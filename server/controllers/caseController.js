import mongoose from "mongoose";
import path from "node:path";
import { unlink } from "node:fs/promises";
import Case from "../models/Case.js";
import { uploadsDirectory } from "../middleware/caseAttachments.js";
import { generateCaseNumber } from "../utils/caseNumber.js";

const removeUploadedFiles = async (files = []) => {
	await Promise.all(
		files.map((file) =>
			unlink(file.path).catch((error) => {
				console.error("Failed to remove unattached case file:", error);
			}),
		),
	);
};

export const getCases = async (req, res) => {
	try {
		const cases = await Case.find({
			recordType: "case",
			completionStatus: "complete",
		})
			.populate("assignment.assignedTo", "username email")
			.populate("assignment.assignedVolunteer", "name role email")
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
		})
			.populate("assignment.assignedTo", "username email")
			.populate("assignment.assignedVolunteer", "name role email");

		if (!caseRecord) {
			return res.status(404).json({ message: "Case not found." });
		}

		return res.json(caseRecord);
	} catch (error) {
		console.error("Failed to fetch case:", error);
		return res.status(500).json({ message: "Failed to fetch case" });
	}
};

export const getCaseFile = async (req, res) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ message: "Invalid case ID." });
		}

		const caseRecord = await Case.findOne({
			_id: req.params.id,
			recordType: "case",
			completionStatus: "complete",
		}).select("attachments");

		const attachment = (caseRecord?.attachments ?? []).find(
			(file) => file.id === req.params.fileId,
		);
		if (
			!attachment ||
			path.basename(attachment.storedName) !== attachment.storedName
		) {
			return res.status(404).json({ message: "File not found." });
		}

		const filePath = path.join(uploadsDirectory, attachment.storedName);
		if (req.query.download === "1") {
			return res.download(filePath, attachment.originalName, (error) => {
				if (error && !res.headersSent) {
					console.error("Failed to download case file:", error);
					res.status(404).json({ message: "File could not be downloaded." });
				}
			});
		}

		res.type(attachment.mimeType);
		return res.sendFile(filePath, (error) => {
			if (error && !res.headersSent) {
				console.error("Failed to display case file:", error);
				res.status(404).json({ message: "File could not be displayed." });
			}
		});
	} catch (error) {
		console.error("Failed to fetch case file:", error);
		return res.status(500).json({ message: "Failed to fetch case file." });
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
			.populate("assignment.assignedVolunteer", "name role email")
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
		return res
			.status(500)
			.json({ message: "Failed to fetch admission drafts" });
	}
};

const workflowFilter = [
	{ status: "new_report", label: "New Reports" },
	{ status: "assessment", label: "Assessment" },
	{ status: "in_care", label: "In Care" },
	{ status: "release_ready", label: "Release Ready" },
	{ status: "closed", label: "Closed" },
];

const animalTypeGroups = [
	{ type: "bird", label: "Birds" },
	{ type: "mammal", label: "Mammals" },
	{ type: "reptile", label: "Reptiles" },
	{ type: "other", label: "Other" },
];

export const getWorkflowStageCounts = async (req, res) => {
	try {
		const values = await Promise.all(
			workflowFilter.map(({ status }) =>
				Case.countDocuments({
					recordType: "case",
					completionStatus: "complete",
					status,
				}),
			),
		);

		return res.json({
			labels: workflowFilter.map(({ label }) => label),
			values,
		});
	} catch (err) {
		console.error("Failed to fetch workflow stage counts:", err);
		return res
			.status(500)
			.json({ message: "Failed to fetch workflow stage counts" });
	}
};

export const getAnimalTypeCounts = async (req, res) => {
	try {
		const values = await Promise.all(
			animalTypeGroups.map(({ type }) =>
				Case.countDocuments({
					recordType: "case",
					completionStatus: "complete",
					"animal.type": type,
				}),
			),
		);

		return res.json({
			labels: animalTypeGroups.map(({ label }) => label),
			values,
		});
	} catch (error) {
		console.error("Failed to fetch animal type counts:", error);
		return res
			.status(500)
			.json({ message: "Failed to fetch animal type counts" });
	}
};

export const getActiveSpeciesBreakdown = async (req, res) => {
	try {
		const activeCaseFilter = {
			recordType: "case",
			completionStatus: "complete",
			status: { $in: ["in_care", "release_ready"] },
		};
		const values = await Promise.all(
			animalTypeGroups.map(({ type }) =>
				Case.countDocuments({
					...activeCaseFilter,
					"animal.type": type,
				}),
			),
		);

		return res.json({
			labels: animalTypeGroups.map(({ label }) => label),
			values,
			total: values.reduce((sum, value) => sum + value, 0),
		});
	} catch (error) {
		console.error("Failed to fetch active species breakdown:", error);
		return res
			.status(500)
			.json({ message: "Failed to fetch active species breakdown" });
	}
};

export const getAdmissionsReleases = async (req, res) => {
	try {
		const currentMonth = new Date();
		currentMonth.setUTCDate(1);
		currentMonth.setUTCHours(0, 0, 0, 0);

		const months = Array.from({ length: 6 }, (_, index) => {
			const start = new Date(currentMonth);
			start.setUTCMonth(currentMonth.getUTCMonth() - (5 - index));
			const end = new Date(start);
			end.setUTCMonth(end.getUTCMonth() + 1);

			return {
				start,
				end,
				label: new Intl.DateTimeFormat("en", {
					month: "short",
					timeZone: "UTC",
				}).format(start),
			};
		});

		const counts = await Promise.all(
			months.map(async ({ start, end }) => {
				const [admissions, releases] = await Promise.all([
					Case.countDocuments({
						recordType: "case",
						completionStatus: "complete",
						$or: [
							{ admittedAt: { $gte: start, $lt: end } },
							{
								admittedAt: null,
								createdAt: { $gte: start, $lt: end },
							},
						],
					}),
					Case.countDocuments({
						recordType: "case",
						completionStatus: "complete",
						status: "closed",
						"outcome.date": { $gte: start, $lt: end },
					}),
				]);

				return { admissions, releases };
			}),
		);

		return res.json({
			labels: months.map(({ label }) => label),
			admissions: counts.map(({ admissions }) => admissions),
			releases: counts.map(({ releases }) => releases),
		});
	} catch (error) {
		console.error("Failed to fetch admissions and releases:", error);
		return res
			.status(500)
			.json({ message: "Failed to fetch admissions and releases" });
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
		return res
			.status(500)
			.json({ message: "Failed to delete admission draft" });
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
		const body = req.body?.caseData
			? JSON.parse(req.body.caseData)
			: (req.body ?? {});
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			await removeUploadedFiles(req.files);
			return res.status(400).json({ message: "Invalid case data." });
		}
		const { animal = {}, finder = {}, incident = {} } = body;
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
			await removeUploadedFiles(req.files);
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		const caseNumber =
			body.recordType === "case" ? await generateCaseNumber() : undefined;
		const attachments = (req.files ?? []).map((file) => ({
			id: file.caseAttachmentId,
			originalName: file.originalname,
			storedName: file.filename,
			mimeType: file.mimetype,
			size: file.size,
		}));
		const newCase = await Case.create({ ...body, attachments, caseNumber });
		return res.status(201).json(newCase);
	} catch (error) {
		await removeUploadedFiles(req.files);
		if (error instanceof SyntaxError) {
			return res.status(400).json({ message: "Invalid case data." });
		}
		if (error.name === "ValidationError" || error.name === "CastError") {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to create case:", error);
		return res.status(500).json({ message: "Failed to create case" });
	}
};

const editableNestedFields = {
	finder: [
		"name",
		"phone",
		"email",
		"position",
		"reportedAt",
		"consentToContact",
	],
	animal: [
		"type",
		"species",
		"scientificName",
		"lifeStage",
		"sex",
		"microchipId",
	],
	incident: [
		"address",
		"locationName",
		"coordinates",
		"foundAt",
		"weather",
		"description",
	],
	clinical: [
		"weight",
		"temperatureCelsius",
		"heartRateBpm",
		"arrivalCondition",
		"currentCondition",
		"enclosure",
		"carrier",
	],
	assignment: ["assignedVolunteer", "accessLevel", "referralRequired"],
	releasePlan: ["plannedDate", "reviewTime", "location"],
};

export const updateCase = async (req, res) => {
	try {
		const body = req.body?.caseData
			? JSON.parse(req.body.caseData)
			: (req.body ?? {});
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			await removeUploadedFiles(req.files);
			return res.status(400).json({ message: "Invalid case data." });
		}

		if (!mongoose.isValidObjectId(req.params.id)) {
			await removeUploadedFiles(req.files);
			return res.status(400).json({ message: "Invalid case ID." });
		}

		const caseRecord = await Case.findOne({
			_id: req.params.id,
			recordType: "case",
			completionStatus: "complete",
		});
		if (!caseRecord) {
			await removeUploadedFiles(req.files);
			return res.status(404).json({ message: "Case not found." });
		}

		for (const field of [
			"intakeSource",
			"status",
			"priority",
			"admissionNotes",
			"careTasks",
		]) {
			if (Object.hasOwn(body, field)) caseRecord.set(field, body[field]);
		}
		for (const [group, fields] of Object.entries(editableNestedFields)) {
			const values = body[group];
			if (!values || typeof values !== "object" || Array.isArray(values)) {
				continue;
			}
			for (const field of fields) {
				if (Object.hasOwn(values, field)) {
					caseRecord.set(`${group}.${field}`, values[field]);
				}
			}
		}

		const newAttachments = (req.files ?? []).map((file) => ({
			id: file.caseAttachmentId,
			originalName: file.originalname,
			storedName: file.filename,
			mimeType: file.mimetype,
			size: file.size,
		}));
		caseRecord.attachments.push(...newAttachments);
		caseRecord.lastSavedAt = new Date();
		await caseRecord.save();
		await caseRecord.populate([
			{ path: "assignment.assignedTo", select: "username email" },
			{ path: "assignment.assignedVolunteer", select: "name role email" },
		]);

		return res.json(caseRecord);
	} catch (error) {
		await removeUploadedFiles(req.files);
		if (error instanceof SyntaxError) {
			return res.status(400).json({ message: "Invalid case data." });
		}
		if (error.name === "ValidationError" || error.name === "CastError") {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to update case:", error);
		return res.status(500).json({ message: "Failed to update case" });
	}
};
