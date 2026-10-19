import { Router } from "express";
import { createCase, getCases } from "../controllers/caseController.js";

const router = Router();

router.get("/", getCases);
router.post("/", createCase);

export default router;