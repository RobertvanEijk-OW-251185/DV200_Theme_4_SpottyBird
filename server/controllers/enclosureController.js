import Enclosure from "../models/Enclosure.js";

export const getEnclosures = async (req, res) => {
	try {
		const enclosures = await Enclosure.find().sort({ name: 1 }).lean();
		return res.json(enclosures.map(({ _id, name }) => ({ _id, name })));
	} catch (error) {
		console.error("Failed to fetch enclosures:", error);
		return res.status(500).json({ message: "Failed to fetch enclosures" });
	}
};
