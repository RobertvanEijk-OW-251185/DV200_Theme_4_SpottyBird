import { Router } from "express";
import {
	createCase,
	createDraft,
	deleteDraft,
	getAdmissionsReleases,
	getCaseById,
	getCaseFile,
	getCaseSummary,
	getCases,
	getDraftCount,
	getDrafts,
	getRehabilitation,
	getActiveSpeciesBreakdown,
	getAnimalTypeCounts,
	getWorkflowStageCounts,
	updateCase,
} from "../controllers/caseController.js";
import { parseCaseAttachments } from "../middleware/caseAttachments.js";

const router = Router();

router.get("/summary", getCaseSummary);
router.get("/", getCases);
router.post("/", parseCaseAttachments, createCase);

router.get("/rehabilitation", getRehabilitation);

router.get("/drafts/count", getDraftCount);
router.get("/drafts", getDrafts);
router.post("/drafts", createDraft);
router.delete("/drafts/:id", deleteDraft);

router.get("/animal-types", getAnimalTypeCounts);
router.get("/species-breakdown", getActiveSpeciesBreakdown);
router.get("/admissions-releases", getAdmissionsReleases);
router.get("/workflow-stages", getWorkflowStageCounts);

router.get("/:id/files/:fileId", getCaseFile);
router.patch("/:id", parseCaseAttachments, updateCase);
router.get("/:id", getCaseById);

export default router;
