import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		if (
			typeof email !== "string" ||
			typeof password !== "string" ||
			!email.trim() ||
			!password
		) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email: email.trim().toLowerCase() });

		if (!user || !(await user.matchPassword(password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = generateToken(user._id);

		return res.status(200).json({
			id: user._id,
			username: user.username,
			email: user.email,
			token,
		});
	} catch (err) {
		console.error("Login failed:", err.message);
		return res.status(500).json({ message: "Server error" });
	}
});

// Me
router.get("/me", protect, async (req, res) => {
	res.status(200).json(req.user);
});

// Generate JWT token
const generateToken = (id) => {
	return jwt.sign({ id: String(id) }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

export default router;
