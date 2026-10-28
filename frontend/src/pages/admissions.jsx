// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Admissions.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import AdmissionFormTextInputComponent from "../components/admissionFormTextInput";
import AdmissionFormDropDownInputComponent from "../components/admissionFormDropDownInput";
import AdmissionFormTextNotesInputComponent from "../components/admissionFormTextNotesInput";
import SavedDraftsPopUp from "../components/savedDraftPopup";

// import React things
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

function buildAdmissionPayload(form, recordType) {
	const formData = new FormData(form);
	const value = (name) => String(formData.get(name) ?? "").trim();
	const numberValue = (name) => {
		const fieldValue = value(name);
		return fieldValue ? Number(fieldValue) : undefined;
	};

	// co-ordinates and validation
	const coordinatesInput = value("coordinates");
	const coordinates = coordinatesInput
		.split(",")
		.map((coordinate) => Number(coordinate.trim()));
	const hasCoordinates =
		coordinates.length === 2 && coordinates.every(Number.isFinite);
	if (coordinatesInput && !hasCoordinates) {
		throw new Error("Enter GPS coordinates as latitude, longitude.");
	}

	const completionStatus = recordType === "draft" ? "incomplete" : "complete";

	const payload = {
		recordType,
		completionStatus,

		intakeSource: value("intakeSource") || "public_report",
		status: value("status") || "new_report",
		priority: value("priority") || "medium",
		finder: {
			name: value("finderName"),
			phone: value("finderPhone"),
			email: value("finderEmail"),
			position: value("finderPosition"),
			reportedAt: value("reportedAt") || undefined,
			consentToContact:
				value("consentToContact") === "yes"
					? true
					: value("consentToContact") === "no"
						? false
						: undefined,
		},
		animal: {
			type: value("animalType") || undefined,
			species: value("species"),
			scientificName: value("scientificName"),
			lifeStage: value("lifeStage"),
			sex: value("sex"),
			microchipId: value("microchipId"),
		},
		incident: {
			address: value("address"),
			foundAt: value("foundAt") || undefined,
			weather: value("weather"),
			...(hasCoordinates
				? {
						coordinates: {
							latitude: coordinates[0],
							longitude: coordinates[1],
						},
					}
				: {}),
			description: value("incidentDescription"),
		},
		clinical: {
			weight: {
				value: numberValue("weight"),
				unit: value("weightUnit"),
			},
			temperatureCelsius: numberValue("temperature"),
			heartRateBpm: numberValue("heartRate"),
			arrivalCondition: value("arrivalCondition"),
			currentCondition: value("currentCondition"),
			enclosure: value("enclosure"),
			carrier: value("carrier"),
		},
		assignment: {
			assignedVolunteer: value("assignedVolunteer") || null,
			accessLevel: value("accessLevel"),
			referralRequired:
				value("referralRequired") === "yes"
					? true
					: value("referralRequired") === "no"
						? false
						: undefined,
		},
		releasePlan: {
			plannedDate: value("plannedDate") || undefined,
			reviewTime: value("reviewTime"),
			location: value("releaseLocation"),
		},
		admissionNotes: value("admissionNotes"),
		careTasks: value("careTasks"),
	};

	return payload;
}

function formatDateForInput(value, inputType) {
	if (!value) return "";
	if (inputType === "date" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
		return value.slice(0, 10);
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return date.toISOString().slice(0, inputType === "date" ? 10 : 16);
}

function populateAdmissionForm(form, record) {
	const coordinates = record.incident?.coordinates;
	const assignedVolunteer = record.assignment?.assignedVolunteer;
	const values = {
		plannedDate: record.releasePlan?.plannedDate,
		reviewTime: record.releasePlan?.reviewTime,
		releaseLocation: record.releasePlan?.location,
		finderName: record.finder?.name,
		finderPhone: record.finder?.phone,
		finderEmail: record.finder?.email,
		finderPosition: record.finder?.position,
		reportedAt: record.finder?.reportedAt,
		intakeSource: record.intakeSource,
		animalType: record.animal?.type,
		species: record.animal?.species,
		scientificName: record.animal?.scientificName,
		lifeStage: record.animal?.lifeStage,
		sex: record.animal?.sex,
		microchipId: record.animal?.microchipId,
		address: record.incident?.address,
		foundAt: record.incident?.foundAt,
		weather: record.incident?.weather,
		coordinates:
			Number.isFinite(coordinates?.latitude) &&
			Number.isFinite(coordinates?.longitude)
				? `${coordinates.latitude}, ${coordinates.longitude}`
				: "",
		incidentDescription: record.incident?.description,
		weight: record.clinical?.weight?.value,
		weightUnit: record.clinical?.weight?.unit,
		temperature: record.clinical?.temperatureCelsius,
		heartRate: record.clinical?.heartRateBpm,
		arrivalCondition: record.clinical?.arrivalCondition,
		currentCondition: record.clinical?.currentCondition,
		enclosure: record.clinical?.enclosure,
		carrier: record.clinical?.carrier,
		priority: record.priority,
		careTasks: record.careTasks,
		status: record.status,
		assignedVolunteer:
			typeof assignedVolunteer === "object"
				? assignedVolunteer?._id
				: assignedVolunteer,
		accessLevel: record.assignment?.accessLevel,
		referralRequired:
			record.assignment?.referralRequired === true
				? "yes"
				: record.assignment?.referralRequired === false
					? "no"
					: "",
		consentToContact:
			record.finder?.consentToContact === true
				? "yes"
				: record.finder?.consentToContact === false
					? "no"
					: "",
		admissionNotes: record.admissionNotes,
	};

	form.reset();
	for (const [name, value] of Object.entries(values)) {
		const field = form.elements.namedItem(name);
		if (!field) continue;

		field.value =
			name === "plannedDate" || name === "reportedAt" || name === "foundAt"
				? formatDateForInput(value, field.type)
				: (value ?? "");
	}
}

function Admissions() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const formRef = useRef(null);
	const attachmentInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [volunteers, setVolunteers] = useState([]);
	const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(true);
	const [volunteerError, setVolunteerError] = useState("");
	const [enclosures, setEnclosures] = useState([]);
	const [isLoadingEnclosures, setIsLoadingEnclosures] = useState(true);
	const [enclosureError, setEnclosureError] = useState("");

	const [draftCount, setDraftCount] = useState(null);
	const [draftCountError, setDraftCountError] = useState("");
	const [isDraftPopupOpen, setIsDraftPopupOpen] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const caseId = searchParams.get("caseId");
	const [caseToEdit, setCaseToEdit] = useState(null);
	const [isLoadingCase, setIsLoadingCase] = useState(false);

	useEffect(() => {
		const controller = new AbortController();

		const loadVolunteers = async () => {
			const token = localStorage.getItem("authToken");
			if (!token) {
				setVolunteerError("Log in to load the volunteer list.");
				setIsLoadingVolunteers(false);
				return;
			}

			try {
				const response = await fetch("/api/volunteers", {
					headers: { Authorization: `Bearer ${token}` },
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Unable to load volunteers (${response.status}).`,
					);
				}
				if (!Array.isArray(result)) {
					throw new Error("The server returned an invalid volunteer list.");
				}

				setVolunteers(result);
			} catch (error) {
				if (error.name !== "AbortError") {
					setVolunteerError(error.message || "Unable to load volunteers.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoadingVolunteers(false);
				}
			}
		};

		const loadDraftCount = async () => {
			try {
				const response = await fetch("/api/cases/drafts/count", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}
				if (!Number.isInteger(result.count) || result.count < 0) {
					throw new Error("The server returned an invalid draft count.");
				}

				setDraftCount(result.count);
			} catch (error) {
				if (error.name !== "AbortError") {
					setDraftCountError(error.message || "Unable to load draft count.");
				}
			}
		};

		const loadEnclosures = async () => {
			try {
				const response = await fetch("/api/enclosures", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Unable to load enclosures (${response.status}).`,
					);
				}
				if (!Array.isArray(result)) {
					throw new Error("The server returned an invalid enclosure list.");
				}

				setEnclosures(result);
			} catch (error) {
				if (error.name !== "AbortError") {
					setEnclosureError(error.message || "Unable to load enclosures.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoadingEnclosures(false);
				}
			}
		};

		loadVolunteers();
		loadEnclosures();
		loadDraftCount();
		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!caseId) return undefined;

		const controller = new AbortController();
		const loadCase = async () => {
			setIsLoadingCase(true);
			setFeedback(null);

			try {
				const response = await fetch(`/api/cases/${caseId}`, {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Unable to load case (${response.status}).`,
					);
				}

				setCaseToEdit(result);
			} catch (error) {
				if (error.name !== "AbortError") {
					setFeedback({
						type: "error",
						message: `Unable to load case details: ${error.message}`,
					});
				}
			} finally {
				if (!controller.signal.aborted) setIsLoadingCase(false);
			}
		};

		loadCase();
		return () => controller.abort();
	}, [caseId]);

	useEffect(() => {
		if (
			!caseToEdit ||
			isLoadingVolunteers ||
			isLoadingEnclosures ||
			!formRef.current
		) {
			return;
		}

		populateAdmissionForm(formRef.current, caseToEdit);
	}, [caseToEdit, isLoadingVolunteers, isLoadingEnclosures]);

	const handleClearForm = (event) => {
		event.currentTarget.form.reset();
		if (attachmentInputRef.current) attachmentInputRef.current.value = "";
		setSelectedFiles([]);
		setFeedback(null);
	};

	const handleContinueDraft = (draft) => {
		const form = formRef.current;
		if (!form) {
			setFeedback({
				type: "error",
				message: "The admission form is unavailable.",
			});
			return;
		}

		form.reset();
		if (attachmentInputRef.current) attachmentInputRef.current.value = "";
		setSelectedFiles([]);
		populateAdmissionForm(form, draft);

		setIsDraftPopupOpen(false);
		setFeedback({
			type: "success",
			message: "Draft loaded into the admission form.",
		});
	};

	const handleSaveDraft = async (event) => {
		const form = event.currentTarget.form;
		let payload;

		try {
			payload = buildAdmissionPayload(form, "draft");
		} catch (error) {
			setFeedback({ type: "error", message: error.message });
			return;
		}

		setIsSubmitting(true);
		setFeedback(null);

		try {
			const response = await fetch("/api/cases/drafts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || `Request failed (${response.status})`,
				);
			}

			setDraftCount(result.count);
			setDraftCountError("");
			setFeedback({ type: "success", message: "Draft saved." });
		} catch (error) {
			setFeedback({
				type: "error",
				message: `Unable to save draft: ${error.message}`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (caseId && !caseToEdit) {
			setFeedback({
				type: "error",
				message: "The case must finish loading before it can be updated.",
			});
			return;
		}

		let payload;
		try {
			payload = buildAdmissionPayload(form, "case");
		} catch (error) {
			setFeedback({ type: "error", message: error.message });
			return;
		}
		if (caseId && caseToEdit) {
			const hiddenFields = [
				["finderPosition", "finder", "position"],
				["carrier", "clinical", "carrier"],
				["plannedDate", "releasePlan", "plannedDate"],
				["reviewTime", "releasePlan", "reviewTime"],
				["releaseLocation", "releasePlan", "location"],
				["accessLevel", "assignment", "accessLevel"],
			];
			for (const [inputName, group, field] of hiddenFields) {
				if (!form.elements.namedItem(inputName)) {
					payload[group][field] = caseToEdit[group]?.[field];
				}
			}
			if (
				!form.elements.namedItem("coordinates") &&
				caseToEdit.incident?.coordinates
			) {
				payload.incident.coordinates = caseToEdit.incident.coordinates;
			}
		}

		setIsSubmitting(true);
		setFeedback(null);
		try {
			const requestBody = new FormData();
			requestBody.set("caseData", JSON.stringify(payload));
			selectedFiles.forEach((file) => requestBody.append("attachments", file));

			const response = await fetch(
				caseId ? `/api/cases/${caseId}` : "/api/cases",
				{
					method: caseId ? "PATCH" : "POST",
					body: requestBody,
				},
			);
			const result = await response.json();
			if (!response.ok) {
				setFeedback({
					type: "error",
					message: result.message || `Request failed (${response.status})`,
				});
				return;
			}

			if (caseId) {
				navigate(`/case/${caseId}`);
			} else {
				setFeedback({
					type: "success",
					message: `Admission saved to the database. Case ID: ${result.caseNumber || result._id}`,
				});
				form.reset();
				if (attachmentInputRef.current) attachmentInputRef.current.value = "";
				setSelectedFiles([]);
			}
		} catch (error) {
			setFeedback({
				type: "error",
				message: `Unable to submit admission: ${error.message}`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFileSelection = (event) => {
		const files = Array.from(event.currentTarget.files ?? []);
		event.currentTarget.value = "";

		const allowedFileName = /\.(jpe?g|png|pdf|docx?)$/i;
		const invalidFile = files.find(
			(file) =>
				!allowedFileName.test(file.name) || file.size > 10 * 1024 * 1024,
		);
		if (invalidFile) {
			setFeedback({
				type: "error",
				message: `${invalidFile.name} is not supported or exceeds 10 MB. Use JPG, PNG, PDF, DOC, or DOCX files.`,
			});
			return;
		}

		if (selectedFiles.length + files.length > 20) {
			setFeedback({
				type: "error",
				message: "You can attach up to 20 files to one admission.",
			});
			return;
		}

		setSelectedFiles((currentFiles) => [...currentFiles, ...files]);
		setFeedback(null);
	};

	const removeSelectedFile = (fileIndex) => {
		setSelectedFiles((currentFiles) =>
			currentFiles.filter((_, index) => index !== fileIndex),
		);
	};

	return (
		<div className="main_content">
			<PageHeaderComponent
				title={caseId ? "Edit Case Details" : "Admission"}
				description={
					caseId
						? "Update this animal's existing case information."
						: "Case identification numbers , locations status and priorities all in one place"
				}
			/>
			<div className="admissions_forms">
				<div className="drafts_button_container">
					<div className="left_information">
						<h3>Saved Admissions Drafts</h3>
						<p>
							Continue incomplete case records without re-entering information.
						</p>
						<p>
							Draft Amount:{" "}
							{draftCount ?? (draftCountError ? "Unavailable" : "Loading...")}
						</p>
						{draftCountError && <p role="status">{draftCountError}</p>}
					</div>
					<button
						className="view_drafts_btn"
						type="button"
						onClick={() => setIsDraftPopupOpen(true)}>
						<h2>View Drafts</h2>
					</button>
				</div>
				{isDraftPopupOpen && (
					<SavedDraftsPopUp
						onClose={() => setIsDraftPopupOpen(false)}
						onContinue={handleContinueDraft}
						onCountChange={setDraftCount}
					/>
				)}
				{isLoadingCase && <p role="status">Loading case details...</p>}
				{/* <div className="intake_details_container">
					<div className="new_case_intake_info">
						<h3>New Case Intake</h3>
						<p>
							Complete the required details before admitting the animal.
							Required fields are marked with *.
						</p>
					</div>
					<div className="new_case_intake_progress_markers">
						<div className="progress_1 progress_complete">
							<FontAwesomeIcon icon={faCheck} />
							<p>1 Intake Source</p>
						</div>
						<div className="progress_2">
					
							<p>2 Case Details</p>
						</div>
						<div className="progress_3">
					
							<p>3 Clinical Intake</p>
						</div>
						<div className="progress_4">
					
							<p>4 Release Planning</p>
						</div>
					</div>
				</div> */}
				<form
					ref={formRef}
					className="form_container"
					onSubmit={handleSubmit}>
					{/* <div className="release_date_form_container">
						<div className="form_container_title_block">
							<h3>Release Date Block</h3>
							<p>
								Schedule the expected release or review date. This can be
								updated later.
							</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Planned Release Date"
								placeholder="24 May 2025"
								name="plannedDate"
								type="date"
							/>
							<AdmissionFormTextInputComponent
								title="Review Time"
								placeholder="09:00"
								name="reviewTime"
								type="time"
							/>
							<AdmissionFormTextInputComponent
								title="Release Location"
								placeholder="Enter Location"
								name="releaseLocation"
							/>
						</div>
					</div> */}
					<div className="finder_report_details_form_container">
						<div className="form_container_title_block">
							<h3>Finder & Report Details</h3>
							<p>
								Who reported or found the animal and how the case entered the
								system.
							</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="First Name*"
								placeholder="Jane Doe"
								name="finderName"
								required
							/>
							<AdmissionFormTextInputComponent
								title="Phone*"
								placeholder="012 345 6789"
								name="finderPhone"
								type="tel"
								required
							/>
							<AdmissionFormTextInputComponent
								title="Email Address"
								placeholder="janedoe@email.com"
								name="finderEmail"
								type="email"
							/>
						</div>
						<div className="form_container_content">
							{/* <AdmissionFormTextInputComponent
								title="Position"
								placeholder="Emily Rogers"
								name="finderPosition"
							/> */}
							<AdmissionFormTextInputComponent
								title="Reported Date & Time*"
								placeholder="16 May 2025, 14:45"
								name="reportedAt"
								type="datetime-local"
								required
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Intake Source"
								placeholder="Select intake source"
								name="intakeSource"
								options={[
									{ label: "Public report", value: "public_report" },
									{ label: "WhatsApp", value: "whatsapp" },
									{ label: "Staff", value: "staff" },
									{ label: "Other", value: "other" },
								]}
							/>
						</div>
					</div>
					<div className="case_classification_form_container">
						<div className="form_container_title_block">
							<h3>Case Classification</h3>
							<p>Core animal identifiers and operational case status.</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Animal Type*"
								placeholder="Select Animal Type"
								name="animalType"
								required
								options={[
									{ label: "Bird", value: "bird" },
									{ label: "Mammal", value: "mammal" },
									{ label: "Reptile", value: "reptile" },
									{ label: "Other", value: "other" },
								]}
							/>
							<AdmissionFormTextInputComponent
								title="Species*"
								placeholder="e.g. Kookaburra"
								name="species"
								required
							/>
							<AdmissionFormTextInputComponent
								title="Scientific Name*"
								placeholder="Dacelo novaeguineae"
								name="scientificName"
								required
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Age / Life Stage*"
								placeholder="Select life stage"
								name="lifeStage"
								required
								options={[
									{ label: "Unknown", value: "unknown" },
									{ label: "Juvenile", value: "juvenile" },
									{ label: "Adult", value: "adult" },
								]}
							/>
							<AdmissionFormDropDownInputComponent
								title="Sex (If Known)"
								placeholder="Select sex"
								name="sex"
								options={[
									{ label: "Unknown", value: "unknown" },
									{ label: "Female", value: "female" },
									{ label: "Male", value: "male" },
								]}
							/>
							<AdmissionFormTextInputComponent
								title="Microchip / ID"
								placeholder="Enter identifier"
								name="microchipId"
							/>
						</div>
					</div>
					<div className="incident_location_form_container">
						<div className="form_container_title_block">
							<h3>Location & Incident</h3>
							<p>
								Where, when and under what circumstances the animal was found.
							</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Found location / address *"
								placeholder="1297 John Vorster Dr, Centurion"
								name="address"
								required
							/>
							{/* <button className="view_map" type="button">
								<h3>View Map</h3>
							</button> */}
						</div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Date / time found *"
								placeholder="16 May 2025, 14:45"
								name="foundAt"
								type="datetime-local"
								required
							/>
							<AdmissionFormTextInputComponent
								title="Weather conditions"
								placeholder="Overcast, 18°C"
								name="weather"
							/>
							{/* <AdmissionFormTextInputComponent
								title="GPS coordinates"
								placeholder="-25.8580, 28.1894"
								name="coordinates"
							/> */}
						</div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Incident description *"
								placeholder="Describe how the animal was found, observed behavior and immediate risks."
								name="incidentDescription"
								required
							/>
						</div>
					</div>
					<div className="clinical_condition_form_container">
						<div className="form_container_title_block">
							<h3>Clinical Intake & Current Condition</h3>
							<p>Record condition, vitals and initial care requirements.</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Weight"
								placeholder="326"
								name="weight"
								type="number"
							/>
							<AdmissionFormDropDownInputComponent
								title="Unit"
								placeholder="g"
								name="weightUnit"
								options={[
									{ label: "g", value: "g" },
									{ label: "kg", value: "kg" },
								]}
							/>
							<AdmissionFormTextInputComponent
								title="Temperature"
								placeholder="38.2 °C"
								name="temperature"
								type="number"
							/>
							<AdmissionFormTextInputComponent
								title="Heart Rate"
								placeholder="Enter BPM"
								name="heartRate"
								type="number"
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Condition On Arrival"
								placeholder="Select condition"
								name="arrivalCondition"
								options={[
									{ label: "Deceased", value: "deceased" },
									{ label: "Critical", value: "critical" },
									{ label: "Moderate", value: "moderate" },
									{ label: "Minor", value: "minor" },
									{ label: "Stable", value: "stable" },
								]}
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormTextNotesInputComponent
								title="Current Condition*"
								placeholder="Describe responsiveness, mobility, breathing, visible injuries and suspected shock."
								name="currentCondition"
								required
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Enclosure"
								placeholder={
									isLoadingEnclosures
										? "Loading enclosures..."
										: "Select Enclosure"
								}
								name="enclosure"
								options={enclosures.map((enclosure) => ({
									label: enclosure.name,
									value: enclosure.name,
								}))}
							/>
							{enclosureError && (
								<p
									role="alert"
									className="admission_feedback admission_feedback_error">
									{enclosureError}
								</p>
							)}
							{/* <AdmissionFormDropDownInputComponent
								title="Box / Carrier"
								placeholder="Select Carrier"
								name="carrier"
							/> */}
							<AdmissionFormDropDownInputComponent
								title="Priority"
								placeholder="Select Urgency"
								name="priority"
								options={[
									{ label: "Low", value: "low" },
									{ label: "Medium", value: "medium" },
									{ label: "High", value: "high" },
									{ label: "Urgent", value: "urgent" },
								]}
							/>
						</div>
					</div>
					<div className="care_actions_tasks_form_container">
						<div className="form_container_title_block">
							<h3>Care Actions, Tasks & Attachments</h3>
							<p>
								Document completed interventions and outstanding care
								requirements.
							</p>
						</div>
						<div className="admission_form_divider"></div>
						{/* <div className="form_container_content_pills">
							<p className="ad_form_input_title">Actions Already Taken</p>
							<div className="pills">
								Condition on arrival buttons go here
								<AdmissionFormPillSelectComponent title="Deceased" />
								<AdmissionFormPillSelectComponent title="Critical" />
								<AdmissionFormPillSelectComponent title="Moderate" />
								<AdmissionFormPillSelectComponent title="Minor" />
								<AdmissionFormPillSelectComponent title="Stable" />
							</div>
						</div> */}
						<div className="form_container_content">
							<AdmissionFormTextNotesInputComponent
								title="Need To Do / Care Tasks"
								placeholder="Add treatment, observation, transport or follow-up tasks. Each item can be assigned and checked off."
								name="careTasks"
							/>
						</div>
						<div className="admission_form_divider"></div>
						<input
							ref={attachmentInputRef}
							className="admission_attachment_input"
							type="file"
							name="attachments"
							accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
							multiple
							onChange={handleFileSelection}
						/>
						<button
							className="upload_images"
							type="button"
							onClick={() => attachmentInputRef.current?.click()}>
							{/* upload icon */}
							<FontAwesomeIcon
								className="uploadIcon"
								icon={faArrowUpFromBracket}
							/>
							<div className="upload_images_text">
								<h3>+ Upload photos or files</h3>
								<p>JPG, PNG, PDF, DOC or DOCX • Max 10 MB each</p>
							</div>
						</button>
						<p className="attachment_draft_note">
							Attachments are saved with the admission, not with drafts.
						</p>
						{selectedFiles.length > 0 && (
							<ul className="selected_attachments">
								{selectedFiles.map((file, index) => (
									<li
										key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
										<span>{file.name}</span>
										<button
											type="button"
											onClick={() => removeSelectedFile(index)}
											aria-label={`Remove ${file.name}`}>
											Remove
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="assignment_consent_release_form_container">
						<div className="form_container_title_block">
							<h3>Assignment, Consent & Release Planning</h3>
							<p>Set ownership, permissions and the next operational step.</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Assigned Volunteer"
								placeholder={
									isLoadingVolunteers ? "Loading volunteers..." : "Unassigned"
								}
								name="assignedVolunteer"
								options={volunteers.map((volunteer) => ({
									label: `${volunteer.name} (${volunteer.role})`,
									value: volunteer._id,
								}))}
							/>
							{volunteerError && (
								<p
									role="alert"
									className="admission_feedback admission_feedback_error">
									{volunteerError}
								</p>
							)}
							<AdmissionFormDropDownInputComponent
								title="Case Status*"
								placeholder="New Admission"
								name="status"
								required
								options={[
									{ label: "New report", value: "new_report" },
									{ label: "Assessment", value: "assessment" },
									{ label: "In care", value: "in_care" },
									{ label: "Release ready", value: "release_ready" },
									{ label: "Closed", value: "closed" },
								]}
							/>
							{/* <AdmissionFormDropDownInputComponent
								title="Access Level*"
								placeholder="View / Edit Rights"
								name="accessLevel"
								required
								options={[
									{ label: "View", value: "view" },
									{ label: "Edit", value: "edit" },
									{ label: "View / Edit", value: "view_edit" },
								]}
							/> */}
						</div>
						<div className="form_container_content">
							{/* <AdmissionFormDropDownInputComponent
								title="Referral Required*"
								placeholder="Select Yes / No"
								name="referralRequired"
								required
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
							/> */}
							<AdmissionFormDropDownInputComponent
								title="Consent to Contact Finder"
								placeholder="Select Consent"
								name="consentToContact"
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
							/>
							{/* <AdmissionFormDropDownInputComponent
								title="Release / Outcome"
								placeholder="Pending Assessment"
							/> */}
						</div>
						<div className="form_container_content">
							<AdmissionFormTextNotesInputComponent
								title="Admission Notes"
								placeholder="Add handover instructions, clinical context or information that must remain visible to the care team."
								name="admissionNotes"
							/>
						</div>
					</div>
					<div className="admission_submit_actions">
						{feedback && (
							<p
								className={`admission_feedback admission_feedback_${feedback.type}`}
								role="status">
								{feedback.message}
							</p>
						)}
						<button
							className="admission_submit_button submit_button"
							type="submit"
							disabled={
								isSubmitting || isLoadingCase || (caseId && !caseToEdit)
							}>
							{isSubmitting
								? caseId
									? "Saving Changes..."
									: "Saving..."
								: caseId
									? "Save Changes"
									: "Admit Animal"}
						</button>
						<div className="extra_actions_buttons">
							<button
								className="clear_form_btn clear_button"
								type="button"
								onClick={handleClearForm}
								disabled={isSubmitting || isLoadingCase}>
								Clear Form
							</button>
							<button
								className="save_draft_btn submit_button"
								type="button"
								onClick={handleSaveDraft}
								disabled={isSubmitting || isLoadingCase || Boolean(caseId)}>
								{isSubmitting ? "Saving..." : "Save Draft"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Admissions;
