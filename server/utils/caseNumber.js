import Counter from "../models/Counter.js";

export async function generateCaseNumber() {
	const year = new Date().getFullYear();
	const counterId = `case-${year}`;

	const counter = await Counter.findOneAndUpdate(
		{ _id: counterId },
		{ $inc: { sequence: 1 } },
		{
			new: true,
			upsert: true,
			setDefaultsOnInsert: true,
		},
	);

	return `SBRC-${year}-${String(counter.sequence).padStart(4, "0")}`;
}
