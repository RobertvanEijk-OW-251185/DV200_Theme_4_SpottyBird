import mongoose from "mongoose";

const { Schema } = mongoose;

const caseSchema = new mongoose.Schema(
	{
		caseNumber: { type: String, unique: true, sparse: true },
		recordType: { type: String, enum: ["draft", "case"], default: "draft" },
		completionStatus: {
			type: String,
			enum: ["incomplete", "complete"],
			default: "incomplete",
		},
		intakeSource: {
			type: String,
			enum: ["public_report", "whatsapp", "staff", "other"],
			default: "public_report",
		},
		status: {
			type: String,
			enum: ["new_report", "assessment", "in_care", "release_ready", "closed"],
			default: "new_report",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		finder: {
			name: String,
			phone: String,
			email: String,
			position: String,
			reportedAt: Date,
			consentToContact: Boolean,
		},
		animal: {
			type: {
				type: String,
				enum: ["bird", "mammal", "reptile", "other"],
			},
			species: String,
			scientificName: String,
			lifeStage: String,
			sex: String,
			microchipId: String,
		},
		incident: {
			address: String,
			locationName: String,
			coordinates: {
				latitude: Number,
				longitude: Number,
			},
			foundAt: Date,
			weather: String,
			description: String,
		},
		clinical: {
			weight: {
				value: Number,
				unit: String,
			},
			temperatureCelsius: Number,
			heartRateBpm: Number,
			arrivalCondition: String,
			currentCondition: String,
			enclosure: String,
			carrier: String,
		},
		assignment: {
			assignedTo: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: null,
			},
			accessLevel: String,
			referralRequired: Boolean,
		},
		releasePlan: { plannedDate: Date, reviewTime: String, location: String },
		outcome: { type: String, date: Date },
		admissionNotes: String,
		careTasks: String,
		admittedAt: Date,
		lastSavedAt: Date,
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true },
);

caseSchema.index({ status: 1, updatedAt: -1 });
caseSchema.index({ "animal.type": 1, status: 1 });

const Case = mongoose.model("Case", caseSchema);

export default Case;
