import { Router } from "express";
import {
	createCase,
	createDraft,
	deleteDraft,
	getAdmissionsReleases,
	getCaseById,
	getCaseSummary,
	getCases,
	getDraftCount,
	getDrafts,
	getRehabilitation,
	getActiveSpeciesBreakdown,
	getAnimalTypeCounts,
	getWorkflowStageCounts,
} from "../controllers/caseController.js";

const router = Router();

router.get("/summary", getCaseSummary);
router.get("/", getCases);
router.post("/", createCase);

router.get("/rehabilitation", getRehabilitation);

router.get("/drafts/count", getDraftCount);
router.get("/drafts", getDrafts);
router.post("/drafts", createDraft);
router.delete("/drafts/:id", deleteDraft);

router.get("/animal-types", getAnimalTypeCounts);
router.get("/species-breakdown", getActiveSpeciesBreakdown);
router.get("/admissions-releases", getAdmissionsReleases);
router.get("/workflow-stages", getWorkflowStageCounts);

router.get("/:id", getCaseById);

export default router;
