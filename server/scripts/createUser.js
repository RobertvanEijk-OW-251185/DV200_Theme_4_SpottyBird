import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const { CREATE_USER_USERNAME, CREATE_USER_EMAIL, CREATE_USER_PASSWORD } =
	process.env;

if (!CREATE_USER_USERNAME || !CREATE_USER_EMAIL || !CREATE_USER_PASSWORD) {
	console.error(
		"Set CREATE_USER_USERNAME, CREATE_USER_EMAIL, and CREATE_USER_PASSWORD in server/.env",
	);
	process.exitCode = 1;
} else {
	try {
		await connectDB();

		const email = CREATE_USER_EMAIL.trim().toLowerCase();
		const existingUser = await User.findOne({
			$or: [{ email }, { username: CREATE_USER_USERNAME.trim() }],
		});

		if (existingUser) {
			throw new Error("A user with that email or username already exists");
		}

		const user = await User.create({
			username: CREATE_USER_USERNAME,
			email,
			password: CREATE_USER_PASSWORD,
		});

		console.log(`Created login for ${user.email}`);
	} catch (error) {
		console.error("Unable to create user:", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
}
