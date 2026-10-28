import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		role: { type: String, required: true, trim: true },
		email: { type: String, trim: true, lowercase: true },
		phone: { type: String, trim: true },
		address: { type: String, trim: true },
		availableFrom: { type: String, default: "08:00" },
		availableTo: { type: String, default: "16:00" },
		isAway: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export default mongoose.model("Volunteer", volunteerSchema);
