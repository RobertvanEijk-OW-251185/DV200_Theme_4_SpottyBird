import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import caseRoutes from "./routes/caseRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/cases", caseRoutes);

app.get("/api/health", (req, res) => {
	res.json({ message: "SpottyBird API is running!!" });
});

app.use("/api/users", authRoutes);

const startServer = async () => {
	await connectDB();

	const port = process.env.PORT || 5001;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

startServer();
