import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
	createVolunteer,
	getVolunteers,
} from "../controllers/volunteerController.js";

const router = Router();

router.use(protect);
router.get("/", getVolunteers);
router.post("/", createVolunteer);

export default router;
