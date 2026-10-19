import Case from "../models/Case.js";

export const getCases = async (req, res) => {
	try {
		const cases = await Case.find().sort({ createdAt: -1 }).limit(50);
		return res.json(cases);
	} catch (error) {
		console.error("Failed to fetch cases:", error);
		return res.status(500).json({ message: "Failed to fetch cases" });
	}
};

export const createCase = async (req, res) => {
	try {
		const { animal = {}, finder = {}, incident = {} } = req.body ?? {};
		const missingFields = [
			["animal.type", animal.type],
			["animal.species", animal.species],
			["animal.scientificName", animal.scientificName],
			["finder.name", finder.name],
			["finder.phone", finder.phone],
			["finder.reportedAt", finder.reportedAt],
			["incident.address", incident.address],
			["incident.foundAt", incident.foundAt],
			["incident.description", incident.description],
		]
			.filter(([, value]) => !value)
			.map(([field]) => field);

		if (missingFields.length) {
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		const newCase = await Case.create(req.body);
		return res.status(201).json(newCase);
	} catch (error) {
		if (error.name === "ValidationError" || error.name === "CastError") {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to create case:", error);
		return res.status(500).json({ message: "Failed to create case" });
	}
};