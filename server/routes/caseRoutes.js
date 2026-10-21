import { Router } from "express";
import {
	createCase,
	getCaseSummary,
	getCases,
} from "../controllers/caseController.js";

const router = Router();

router.get("/summary", getCaseSummary);
router.get("/", getCases);
router.post("/", createCase);

export default router;