import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDirectory = path.resolve(serverDirectory, "../uploads");
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Map([
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".png", "image/png"],
	[".pdf", "application/pdf"],
	[".doc", "application/msword"],
	[
		".docx",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	],
]);

const storage = multer.diskStorage({
	destination: (_req, _file, callback) => {
		mkdir(uploadsDirectory, { recursive: true })
			.then(() => callback(null, uploadsDirectory))
			.catch(callback);
	},
	filename: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		file.caseAttachmentId = randomUUID();
		callback(null, `${file.caseAttachmentId}${extension}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: maxFileSize, files: 20 },
	fileFilter: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		if (allowedTypes.get(extension) !== file.mimetype) {
			callback(new Error("Only JPG, PNG, PDF, DOC, and DOCX files are allowed."));
			return;
		}
		callback(null, true);
	},
});

export const parseCaseAttachments = (req, res, next) => {
	upload.array("attachments", 20)(req, res, async (error) => {
		if (!error) {
			next();
			return;
		}

		await Promise.all(
			(req.files ?? []).map((file) =>
				unlink(file.path).catch((cleanupError) => {
					console.error("Failed to remove rejected attachment:", cleanupError);
				}),
			),
		);

		if (error instanceof multer.MulterError || error.message.startsWith("Only ")) {
			return res.status(400).json({ message: error.message });
		}

		console.error("Failed to receive case attachments:", error);
		return res.status(500).json({ message: "Failed to receive attachments." });
	});
};
