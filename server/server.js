import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../server/config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
	res.json({ message: "SpottyBird API is running!!" });
});

const startServer = async () => {
	await connectDB;

	const port = process.env.PORT || 5001;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

startServer();
