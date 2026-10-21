import { Router } from "express";
import {
	createCase,
	getCaseSummary,
	getCases,
	getRehabilitation,
} from "../controllers/caseController.js";

const router = Router();

router.get("/summary", getCaseSummary);
router.get("/", getCases);
router.post("/", createCase);

router.get("/rehabilitation", getRehabilitation);

export default router;
