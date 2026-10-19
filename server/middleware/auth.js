import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorisation &&
		req.headers.authorisation.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorisation.split(" ")[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.id).select("-password");

			return next();
		} catch (err) {
			console.error("Token verification failed: ", err.message);
			return res.status(401).json({ message: "Not authorised, token failed" });
		}
	}
	return res.status(401).json({ message: "Not authorised, token failed" });
};
