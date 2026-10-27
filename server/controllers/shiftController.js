import mongoose from "mongoose";
import Shift from "../models/Shift.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PERIOD_TIMES = {
	morning: ["08:00", "12:00"],
	afternoon: ["12:00", "16:00"],
	evening: ["16:00", "20:00"],
};

export const getShifts = async (req, res) => {
	try {
		const { from, to } = req.query;
		if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
			return res
				.status(400)
				.json({ message: "from and to must be YYYY-MM-DD." });
		}
		const shifts = await Shift.find({ date: { $gte: from, $lte: to } })
			.populate("assignees", "name role")
			.sort({ date: 1, period: 1 });
		return res.json(shifts);
	} catch (error) {
		console.error("Failed to fetch shifts:", error);
		return res.status(500).json({ message: "Failed to fetch shifts" });
	}
};

export const createShift = async (req, res) => {
	try {
		const { date, period, role, capacity } = req.body;
		const times = PERIOD_TIMES[period];
		if (!times) return res.status(400).json({ message: "Invalid period." });

		const shift = await Shift.create({
			date,
			period,
			role,
			capacity: capacity || 1,
			startTime: times[0],
			endTime: times[1],
			createdBy: req.user._id,
		});
		return res.status(201).json(shift);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const assignVolunteer = async (req, res) => {
	try {
		const { id } = req.params;
		const { volunteerId } = req.body;
		if (
			!mongoose.isValidObjectId(id) ||
			!mongoose.isValidObjectId(volunteerId)
		) {
			return res.status(400).json({ message: "Invalid ID." });
		}

		const shift = await Shift.findById(id);
		if (!shift) return res.status(404).json({ message: "Shift not found." });

		// Same person can't be in two shifts in the same slot
		const clash = await Shift.exists({
			_id: { $ne: id },
			date: shift.date,
			period: shift.period,
			assignees: volunteerId,
		});
		if (clash) {
			return res
				.status(409)
				.json({ message: "Volunteer already has a shift in this slot." });
		}

		// Atomic: only adds if there's still room and they aren't already in
		const updated = await Shift.findOneAndUpdate(
			{
				_id: id,
				assignees: { $ne: volunteerId },
				$expr: { $lt: [{ $size: "$assignees" }, "$capacity"] },
			},
			{ $addToSet: { assignees: volunteerId } },
			{ returnDocument: "after" },
		).populate("assignees", "name role");

		if (!updated) {
			return res
				.status(409)
				.json({ message: "Shift is full or already assigned." });
		}
		return res.json(updated);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const unassignVolunteer = async (req, res) => {
	try {
		const updated = await Shift.findByIdAndUpdate(
			req.params.id,
			{ $pull: { assignees: req.body.volunteerId } },
			{ returnDocument: "after" },
		).populate("assignees", "name role");
		if (!updated) return res.status(404).json({ message: "Shift not found." });
		return res.json(updated);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
