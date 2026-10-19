// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Admissions.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import AdmissionFormTextInputComponent from "../components/admissionFormTextInput";
import AdmissionFormDropDownInputComponent from "../components/admissionFormDropDownInput";
import AdmissionFormTextNotesInputComponent from "../components/admissionFormTextNotesInput";
import AdmissionFormPillSelectComponent from "../components/admissionFormPillSelector";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Admissions() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const value = (name) => String(formData.get(name) ?? "").trim();
		const numberValue = (name) => {
			const fieldValue = value(name);
			return fieldValue ? Number(fieldValue) : undefined;
		};
		const coordinatesInput = value("coordinates");
		const coordinates = coordinatesInput
			.split(",")
			.map((coordinate) => Number(coordinate.trim()));
		const hasCoordinates =
			coordinates.length === 2 && coordinates.every(Number.isFinite);
		if (coordinatesInput && !hasCoordinates) {
			setFeedback({
				type: "error",
				message: "Enter GPS coordinates as latitude, longitude.",
			});
			return;
		}

		const payload = {
			recordType: "case",
			completionStatus: "complete",
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
				type: value("animalType"),
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

		setIsSubmitting(true);
		setFeedback(null);
		try {
			const response = await fetch("/api/cases", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await response.json();
			if (!response.ok) {
				setFeedback({
					type: "error",
					message: result.message || `Request failed (${response.status})`,
				});
				return;
			}

			setFeedback({
				type: "success",
				message: `Admission saved to the database. Case ID: ${result._id}`,
			});
			form.reset();
		} catch (error) {
			setFeedback({
				type: "error",
				message: `Unable to submit admission: ${error.message}`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Admission"
				description="Case identification numbers , locations status and priorities all in one place"
			/>
			<div className="admissions_forms">
				<div className="drafts_button_container">
					<div className="left_information">
						<h3>Saved Admissions Drafts</h3>
						<p>
							Continue incomplete case records without re-entering information.
						</p>
						<p>Draft Ammount: ___</p>
					</div>
					<button className="right_btn">
						<h2>View Drafts</h2>
					</button>
				</div>
				<div className="intake_details_container">
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
							{/* <FontAwesomeIcon icon={faCheck} /> */}
							<p>2 Case Details</p>
						</div>
						<div className="progress_3">
							{/* <FontAwesomeIcon icon={faCheck} /> */}
							<p>3 Clinical Intake</p>
						</div>
						<div className="progress_4">
							{/* <FontAwesomeIcon icon={faCheck} /> */}
							<p>4 Release Planning</p>
						</div>
					</div>
				</div>
				<form className="form_container" onSubmit={handleSubmit}>
					<div className="release_date_form_container">
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
					</div>
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
							<AdmissionFormTextInputComponent
								title="Position"
								placeholder="Emily Rogers"
								name="finderPosition"
							/>
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
							<button className="view_map" type="button">
								<h3>View Map</h3>
							</button>
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
							<AdmissionFormTextInputComponent
								title="GPS coordinates"
								placeholder="-25.8580, 28.1894"
								name="coordinates"
							/>
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
								placeholder="Select Enclosure"
								name="enclosure"
							/>
							<AdmissionFormDropDownInputComponent
								title="Box / Carrier"
								placeholder="Select Carrier"
								name="carrier"
							/>
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
						<div className="form_container_content_pills">
							<p className="ad_form_input_title">Actions Already Taken</p>
							<div className="pills">
								{/* Condition on arrival buttons go here */}
								<AdmissionFormPillSelectComponent title="Deceased" />
								<AdmissionFormPillSelectComponent title="Critical" />
								<AdmissionFormPillSelectComponent title="Moderate" />
								<AdmissionFormPillSelectComponent title="Minor" />
								<AdmissionFormPillSelectComponent title="Stable" />
							</div>
						</div>
						<div className="form_container_content">
							<AdmissionFormTextNotesInputComponent
								title="Need To Do / Care Tasks"
								placeholder="Add treatment, observation, transport or follow-up tasks. Each item can be assigned and checked off."
								name="careTasks"
							/>
						</div>
						<div className="admission_form_divider"></div>
						<div className="upload_images">
							{/* upload icon */}
							<FontAwesomeIcon
								className="uploadIcon"
								icon={faArrowUpFromBracket}
							/>
							<div className="upload_images_text">
								<h3>+ Upload photos or files</h3>
								<p>JPG or PNG • Max 10 MB each</p>
							</div>
						</div>
					</div>
					<div className="assignment_consent_release_form_container">
						<div className="form_container_title_block">
							<h3>Assignment, Consent & Release Planning</h3>
							<p>Set ownership, permissions and the next operational step.</p>
						</div>
						<div className="admission_form_divider"></div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Assigned To*"
								placeholder="Select Staff Member"
							/>
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
							<AdmissionFormDropDownInputComponent
								title="Access Level*"
								placeholder="View / Edit Rights"
								name="accessLevel"
								required
								options={[
									{ label: "View", value: "view" },
									{ label: "Edit", value: "edit" },
									{ label: "View / Edit", value: "view_edit" },
								]}
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Referral Required*"
								placeholder="Select Yes / No"
								name="referralRequired"
								required
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
							/>
							<AdmissionFormDropDownInputComponent
								title="Consent to Contact Finder"
								placeholder="Select Consent"
								name="consentToContact"
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
							/>
							<AdmissionFormDropDownInputComponent
								title="Release / Outcome"
								placeholder="Pending Assessment"
							/>
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
								role="status"
							>
								{feedback.message}
							</p>
						)}
						<button
							className="admission_submit_button"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Saving..." : "Admit animal"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Admissions;
