import Volunteer from "../models/Volunteer.js";
import Shift from "../models/Shift.js";

// GET /api/volunteers?date=YYYY-MM-DD  -> each volunteer with a computed status
export const getVolunteers = async (req, res) => {
	try {
		const { date } = req.query;
		const volunteers = await Volunteer.find().sort({ name: 1 }).lean();

		const workingIds = new Set();
		if (date) {
			const shifts = await Shift.find({ date }).select("assignees").lean();
			shifts.forEach((s) =>
				s.assignees.forEach((id) => workingIds.add(String(id))),
			);
		}

		return res.json(
			volunteers.map((v) => ({
				...v,
				status: v.isAway
					? "away"
					: workingIds.has(String(v._id))
						? "working"
						: "available",
			})),
		);
	} catch (error) {
		console.error("Failed to fetch volunteers:", error);
		return res.status(500).json({ message: "Failed to fetch volunteers" });
	}
};

export const createVolunteer = async (req, res) => {
	try {
		const volunteer = await Volunteer.create(req.body);
		return res.status(201).json(volunteer);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
