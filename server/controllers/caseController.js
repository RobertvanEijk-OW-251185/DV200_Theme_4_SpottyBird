import mongoose from "mongoose";
import Case from "../models/Case.js";
import { generateCaseNumber } from "../utils/caseNumber.js";

export const getCases = async (req, res) => {
	try {
		const cases = await Case.find({
			recordType: "case",
			completionStatus: "complete",
		})
			.populate("assignment.assignedTo", "username email")
			.sort({ updatedAt: -1 })
			.limit(50);
		return res.json(cases);
	} catch (error) {
		console.error("Failed to fetch cases:", error);
		return res.status(500).json({ message: "Failed to fetch cases" });
	}
};

export const getCaseById = async (req, res) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: "Invalid case ID." });
		}

		const caseRecord = await Case.findOne({
			_id: req.params.id,
			recordType: "case",
			completionStatus: "complete",
		}).populate("assignment.assignedTo", "username email");

		if (!caseRecord) {
			return res.status(404).json({ message: "Case not found." });
		}

		return res.json(caseRecord);
	} catch (error) {
		console.error("Failed to fetch case:", error);
		return res.status(500).json({ message: "Failed to fetch case" });
	}
};

export const getRehabilitation = async (req, res) => {
	try {
		const cases = await Case.find({
			recordType: "case",
			completionStatus: "complete",
			status: { $in: ["in_care", "release_ready"] },
		})
			.populate("assignment.assignedTo", "username email")
			.sort({ updatedAt: -1 })
			.limit(50);
		return res.json(cases);
	} catch (error) {
		console.error("Failed to fetch cases:", error);
		return res.status(500).json({ message: "Failed to fetch cases" });
	}
};

const draftFilter = {
	recordType: "draft",
	completionStatus: "incomplete",
};

export const getDraftCount = async (req, res) => {
	try {
		const count = await Case.countDocuments(draftFilter);
		return res.json({ count });
	} catch (error) {
		console.error("Failed to fetch draft count: ", error);
		return res.status(500).json({ message: "Failed to fetch draft count" });
	}
};

export const getDrafts = async (req, res) => {
	try {
		const drafts = await Case.find(draftFilter).sort({ updatedAt: -1 });
		return res.json(drafts);
	} catch (error) {
		console.error("Failed to fetch admission drafts:", error);
		return res.status(500).json({ message: "Failed to fetch admission drafts" });
	}
};

export const deleteDraft = async (req, res) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: "Invalid draft ID." });
		}

		const draft = await Case.findOneAndDelete({
			_id: req.params.id,
			...draftFilter,
		});
		if (!draft) {
			return res.status(404).json({ message: "Draft not found." });
		}

		const count = await Case.countDocuments(draftFilter);
		return res.json({ count });
	} catch (error) {
		console.error("Failed to delete admission draft:", error);
		return res.status(500).json({ message: "Failed to delete admission draft" });
	}
};

export const createDraft = async (req, res) => {
	try {
		const draftData = { ...(req.body ?? {}) };
		if (draftData.animal?.type === "") {
			draftData.animal = { ...draftData.animal };
			delete draftData.animal.type;
		}

		const draft = await Case.create({
			...draftData,
			recordType: "draft",
			completionStatus: "incomplete",
			caseNumber: undefined,
		});

		const count = await Case.countDocuments(draftFilter);
		return res.status(201).json({ draft, count });
	} catch (error) {
		if (error.name === "ValidationError" || error.name === "CaseError") {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to save admission draft:", error);
		return res.status(500).json({ message: "Failed to save admission draft" });
	}
};

export const getCaseSummary = async (req, res) => {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recordFilter = { recordType: "case" };
		const needsUpdatingFilter = {
			...recordFilter,
			$or: [
				{ updatedAt: { $lt: thirtyDaysAgo } },
				{ updatedAt: { $in: [null] } },
				{ "animal.type": { $in: [null, ""] } },
				{ "animal.species": { $in: [null, ""] } },
				{ "animal.scientificName": { $in: [null, ""] } },
				{ "finder.name": { $in: [null, ""] } },
				{ "finder.phone": { $in: [null, ""] } },
				{ "finder.reportedAt": { $in: [null, ""] } },
				{ "incident.address": { $in: [null, ""] } },
				{ "incident.foundAt": { $in: [null, ""] } },
				{ "incident.description": { $in: [null, ""] } },
			],
		};

		const [inCare, critical, releaseReady, needsUpdating] = await Promise.all([
			Case.countDocuments({ ...recordFilter, status: "in_care" }),
			Case.countDocuments({ ...recordFilter, priority: "urgent" }),
			Case.countDocuments({ ...recordFilter, status: "release_ready" }),
			Case.countDocuments(needsUpdatingFilter),
		]);

		return res.json({ inCare, critical, releaseReady, needsUpdating });
	} catch (error) {
		console.error("Failed to fetch case summary:", error);
		return res.status(500).json({ message: "Failed to fetch case summary" });
	}
};

export const createCase = async (req, res) => {
	try {
		const { animal = {}, finder = {}, incident = {} } = req.body ?? {};
		const missingFields = [
			["animal.type", animal.type],
			["animal.species", animal.species],
			["animal.scientificName", animal.scientificName],
			["finder.name", finder.name],
			["finder.phone", finder.phone],
			["finder.reportedAt", finder.reportedAt],
			["incident.address", incident.address],
			["incident.foundAt", incident.foundAt],
			["incident.description", incident.description],
		]
			.filter(([, value]) => !value)
			.map(([field]) => field);

		if (missingFields.length) {
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		const caseNumber =
			req.body.recordType === "case" ? await generateCaseNumber() : undefined;
		const newCase = await Case.create({ ...req.body, caseNumber });
		return res.status(201).json(newCase);
	} catch (error) {
		if (error.name === "ValidationError" || error.name === "CastError") {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to create case:", error);
		return res.status(500).json({ message: "Failed to create case" });
	}
};
