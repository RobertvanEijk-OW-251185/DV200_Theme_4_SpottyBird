import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
	assignVolunteer,
	createShift,
	getShifts,
	unassignVolunteer,
} from "../controllers/shiftController.js";

const router = Router();

router.use(protect);
router.get("/", getShifts);
router.post("/", createShift);
router.patch("/:id/assign", assignVolunteer);
router.patch("/:id/unassign", unassignVolunteer);

export default router;
