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

function Admissions() {
	return (
		<div className="main_content">
			<PageHeaderComponent />
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
				<div className="form_container">
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
							/>
							<AdmissionFormTextInputComponent
								title="Review Time"
								placeholder="09:00"
							/>
							<AdmissionFormTextInputComponent
								title="Release Location"
								placeholder="Enter Location"
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
							/>
							<AdmissionFormTextInputComponent
								title="Phone*"
								placeholder="012 345 6789"
							/>
							<AdmissionFormTextInputComponent
								title="Email Address"
								placeholder="janedoe@email.com"
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Position"
								placeholder="Emily Rogers"
							/>
							<AdmissionFormTextInputComponent
								title="Reported Date & Time*"
								placeholder="16 May 2025, 14:45"
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
							/>
							<AdmissionFormDropDownInputComponent
								title="Species*"
								placeholder="Select Species"
							/>
							<AdmissionFormTextInputComponent
								title="Scientific Name*"
								placeholder="Dacelo novaeguineae"
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Age / Life Stage*"
								placeholder="Select life stage"
							/>
							<AdmissionFormDropDownInputComponent
								title="Sex (If Known)"
								placeholder="Select sex"
							/>
							<AdmissionFormTextInputComponent
								title="Microchip / ID"
								placeholder="Enter identifier"
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
							/>
							<button className="view_map">
								<h3>View Map</h3>
							</button>
						</div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Date / time found *"
								placeholder="16 May 2025, 14:45"
							/>
							<AdmissionFormTextInputComponent
								title="Weather conditions"
								placeholder="Overcast, 18°C"
							/>
							<AdmissionFormTextInputComponent
								title="GPS coordinates"
								placeholder="-25.8580, 28.1894"
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormTextInputComponent
								title="Incident description *"
								placeholder="Describe how the animal was found, observed behavior and immediate risks."
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
							/>
							<AdmissionFormDropDownInputComponent
								title="Unit"
								placeholder="g"
							/>
							<AdmissionFormTextInputComponent
								title="Temperature"
								placeholder="38.2 °C"
							/>
							<AdmissionFormTextInputComponent
								title="Heart Rate"
								placeholder="Enter BPM"
							/>
						</div>
						<div className="form_container_content_pills">
							<p className="ad_form_input_title">Condition On Arrival</p>
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
								title="Current Condition*"
								placeholder="Describe responsiveness, mobility, breathing, visible injuries and suspected shock."
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Enclosure"
								placeholder="Select Enclosure"
							/>
							<AdmissionFormDropDownInputComponent
								title="Box / Carrier"
								placeholder="Select Carrier"
							/>
							<AdmissionFormDropDownInputComponent
								title="Priority"
								placeholder="Select Urgency"
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
							/>
							<AdmissionFormDropDownInputComponent
								title="Access Level*"
								placeholder="View / Edit Rights"
							/>
						</div>
						<div className="form_container_content">
							<AdmissionFormDropDownInputComponent
								title="Referral Required*"
								placeholder="Select Yes / No"
								options={[
									{ label: "Yes", value: "yes" },
									{ label: "No", value: "no" },
								]}
							/>
							<AdmissionFormDropDownInputComponent
								title="Consent to Contact Finder"
								placeholder="Select Consent"
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
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Admissions;
