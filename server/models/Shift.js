import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
	{
		date: {
			type: String,
			required: true,
			match: /^\d{4}-\d{2}-\d{2}$/, // "2025-07-14"
		},
		period: {
			type: String,
			enum: ["morning", "afternoon", "evening"],
			required: true,
		},
		role: { type: String, required: true, trim: true },
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
		capacity: { type: Number, default: 1, min: 1 },
		assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true },
);

shiftSchema.index({ date: 1, period: 1 });

export default mongoose.model("Shift", shiftSchema);
