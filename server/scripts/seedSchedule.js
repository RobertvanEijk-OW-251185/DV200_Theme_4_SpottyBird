import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Volunteer from "../models/Volunteer.js";
import Shift from "../models/Shift.js";

dotenv.config();

const toKey = (d) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

try {
	await connectDB();
	await Promise.all([Volunteer.deleteMany({}), Shift.deleteMany({})]);

	const volunteers = await Volunteer.insertMany([
		{
			name: "Sarah J.",
			role: "Wildlife Carer",
			availableFrom: "08:00",
			availableTo: "14:00",
		},
		{
			name: "Liam P.",
			role: "Driver",
			availableFrom: "08:00",
			availableTo: "16:00",
		},
		{
			name: "Tahlia M.",
			role: "Rehab Assistant",
			availableFrom: "12:00",
			availableTo: "20:00",
		},
		{
			name: "Dr. Keira B.",
			role: "Vet Support",
			availableFrom: "08:00",
			availableTo: "14:00",
			isAway: true,
		},
		{
			name: "Maya K.",
			role: "Visitor Coordinator",
			availableFrom: "08:00",
			availableTo: "17:00",
		},
		{
			name: "James T.",
			role: "General Support",
			availableFrom: "08:00",
			availableTo: "20:00",
		},
		{
			name: "Amira N.",
			role: "Vet Assistant",
			availableFrom: "09:00",
			availableTo: "15:00",
		},
		{
			name: "Ravi V.",
			role: "Maintenance",
			availableFrom: "10:00",
			availableTo: "18:00",
		},
	]);

	// Monday of the current week
	const monday = new Date();
	monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

	const slots = [
		{
			period: "morning",
			startTime: "08:00",
			endTime: "12:00",
			role: "Wildlife Feeding",
		},
		{
			period: "afternoon",
			startTime: "12:00",
			endTime: "16:00",
			role: "Visitor Desk",
		},
		{
			period: "evening",
			startTime: "16:00",
			endTime: "20:00",
			role: "Vet Support",
		},
	];

	const shifts = [];
	for (let d = 0; d < 7; d++) {
		const day = new Date(monday);
		day.setDate(monday.getDate() + d);
		slots.forEach((slot, i) => {
			const pick = volunteers[(d + i) % volunteers.length]._id;
			shifts.push({
				...slot,
				date: toKey(day),
				capacity: i === 1 ? 2 : 1,
				assignees: (d + i) % 3 === 0 ? [] : [pick], // leave some open
			});
		});
	}
	await Shift.insertMany(shifts);
	console.log(
		`Seeded ${volunteers.length} volunteers and ${shifts.length} shifts`,
	);
} catch (error) {
	console.error("Seed failed:", error.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
