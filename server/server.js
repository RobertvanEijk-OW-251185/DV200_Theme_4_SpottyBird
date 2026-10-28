import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import caseRoutes from "./routes/caseRoutes.js";
import authRoutes from "./routes/auth.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import enclosureRoutes from "./routes/enclosureRoutes.js";
import Enclosure from "./models/Enclosure.js";

dotenv.config();

const DEFAULT_ENCLOSURES = ["Aviary", "Cages", "Rehab", "Feeding"];

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/cases", caseRoutes);

app.get("/api/health", (req, res) => {
	res.json({ message: "SpottyBird API is running!!" });
});

app.use("/api/users", authRoutes);

app.use("/api/shifts", shiftRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/enclosures", enclosureRoutes);

const startServer = async () => {
	await connectDB();
	await Enclosure.bulkWrite(
		DEFAULT_ENCLOSURES.map((name) => ({
			updateOne: {
				filter: { name },
				update: { $setOnInsert: { name } },
				upsert: true,
			},
		})),
	);

	const port = process.env.PORT || 5001;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

startServer();
