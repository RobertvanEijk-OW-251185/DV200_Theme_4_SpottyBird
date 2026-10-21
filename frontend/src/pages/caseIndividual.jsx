// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/CaseIndividual.css";

// React imports
import { useState } from "react";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Case() {
	const [selectedTask, setSelectedTask] = useState("");

	const handleRadioChange = (event) => {
		setSelectedTask(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Case Details"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
			<div className="individual_case_content_grid">
				<div className="case_info_card individual_case_modules">
					<div className="case_animal_image"></div>
					<div className="animal_info_text">
						<h3>Case Number</h3>
						<div className="priority_tags">
							<p>tag1</p>
							<p>tag2</p>
						</div>
						<div className="bottom_text_case_info">
							<div className="case_assigned_info">
								<div className="animal_names">
									<h3>Animal Name</h3>
									<p>Scientific Name</p>
								</div>
								<div className="report_info">
									<div className="report">
										{/* icon */}
										<div className="report_text">
											<h3>Reported:</h3>
											<p>report date</p>
										</div>
									</div>
									<div className="location">
										{/* icon */}
										<div className="report_text">
											<h3>Location:</h3>
											<p>Reported Location</p>
										</div>
									</div>
								</div>
							</div>
							<div className="vertical_divider">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="2"
									// height="200"
									viewBox="0 0 2 105"
									fill="none">
									<path
										d="M1 1L1 104"
										stroke-width="2"
										stroke-linecap="round"
										stroke="#E9EAE6"
									/>
								</svg>
							</div>
							<div className="case_assignee">
								<h3>Assigned To:</h3>
								<p>Assignee Name Here</p>
							</div>
						</div>
					</div>
				</div>
				<div className="quick_actions individual_case_modules">
					<h3>Quick Actions:</h3>
					<div className="quick_actions_buttons">
						<button className="admit_animal_btn">
							{/* icon */}
							Admit Animal
						</button>
						<button className="edit_case_details_btn">
							{/* icon */}
							Edit Case Details
						</button>
					</div>
				</div>
				<div className="case_details individual_case_modules">
					<h3>Case Details:</h3>
					<div className="case_det_information">
						<div className="cd_info_left">
							<div className="left_info_line">
								<p className="cd_info_title">Animal Type:</p>
								<p>abcd</p>
							</div>
							<div className="left_info_line">
								<p className="cd_info_title">Age / Life Stage:</p>
								<p>abcd</p>
							</div>
							<div className="left_info_line">
								<p className="cd_info_title">Sex (if known):</p>
								<p>abcd</p>
							</div>
							<div className="left_info_line">
								<p className="cd_info_title">Weight (if known):</p>
								<p>abcd</p>
							</div>
							<div className="left_info_line">
								<p className="cd_info_title">Microchip / ID:</p>
								<p>abcd</p>
							</div>
						</div>
						<div className="vertical_divider">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="2"
								height="202"
								viewBox="0 0 2 202"
								fill="none">
								<path
									d="M1 1L1.00001 201"
									stroke-width="2"
									stroke-linecap="round"
									stroke="#E9EAE6"
								/>
							</svg>
						</div>
						<div className="cd_info_right">
							<div className="right_info_line">
								<p className="cd_info_title">Incident Type:</p>
								<p>abcd</p>
							</div>
							<div className="right_info_line">
								<p className="cd_info_title">Date / Time Found:</p>
								<p>abcd</p>
							</div>
							<div className="right_info_line">
								<p className="cd_info_title">Found By:</p>
								<p>abcd</p>
							</div>
							<div className="right_info_line">
								<p className="cd_info_title">Weather Conditions:</p>
								<p>abcd</p>
							</div>
							<div className="right_info_line">
								<p className="cd_info_title">Other Animals Involved:</p>
								<p>abcd</p>
							</div>
						</div>
					</div>
				</div>
				<div className="module4 individual_case_modules">
					<h3>Location:</h3>
				</div>
				<div className="module5 individual_case_modules">
					<h3>Photos:</h3>
				</div>
				<div className="incident_description individual_case_modules">
					<h3>Incident Description:</h3>
					<div className="descriptions">
						<p>
							Found a juvenile kookaburra on the ground near dense bushes. It
							didn't move when approached. Appears weak but alert. Unable to
							fly.
						</p>
						<div className="horizontal_divider">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="256"
								height="2"
								viewBox="0 0 306 2"
								fill="none">
								<path
									d="M1 1L304.65 1"
									stroke-width="2"
									stroke-linecap="round"
									stroke="#E9EAE6"
								/>
							</svg>
						</div>
						<p>Note : No visible injuries or bleeding.</p>
					</div>
				</div>
				<div className="condition_and_vitals individual_case_modules">
					<div className="condition_description">
						<h3>Condition:</h3>
						<p>
							Found a juvenile kookaburra on the ground near dense bushes. It
							didn't move when approached. Appears weak but alert. Unable to
							fly.
						</p>
					</div>
					<div className="horizontal_divider">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="256"
							height="2"
							viewBox="0 0 306 2"
							fill="none">
							<path
								d="M1 1L304.65 1"
								stroke-width="2"
								stroke-linecap="round"
								stroke="#E9EAE6"
							/>
						</svg>
					</div>
					<div className="vitals_description">
						<h3>Vitals:</h3>
						<div className="vitals_info">
							<div className="vitals_info_row">
								<p>Temperature:</p>
								<p>38.2C</p>
							</div>
							<div className="vitals_info_row">
								<p>Heart Rate:</p>
								<p>-</p>
							</div>
						</div>
					</div>
				</div>
				<div className="case_actions individual_case_modules">
					<h3>Actions Taken:</h3>
					<form onSubmit={handleSubmit}>
						<div className="taken_actions_checklist">
							<div className="actions_checklist_row">
								<input
									type="radio"
									name="checklist"
									value="Review Pull Requests"
									checked={selectedTask === "Review Pull Requests"}
									onChange={handleRadioChange}
								/>
								<p>Assessed on site</p>
							</div>
							<div className="actions_checklist_row">
								<input
									type="radio"
									name="checklist"
									value="Review Pull Requests"
									checked={selectedTask === "Review Pull Requests"}
									onChange={handleRadioChange}
								/>
								<p>Assessed on site</p>
							</div>
							<div className="actions_checklist_row">
								<input
									type="radio"
									name="checklist"
									value="Review Pull Requests"
									checked={selectedTask === "Review Pull Requests"}
									onChange={handleRadioChange}
								/>
								<p>Assessed on site</p>
							</div>
							<div className="actions_checklist_row">
								<input
									type="radio"
									name="checklist"
									value="Review Pull Requests"
									checked={selectedTask === "Review Pull Requests"}
									onChange={handleRadioChange}
								/>
								<p>Assessed on site</p>
							</div>
							<div className="actions_checklist_row">
								<input
									type="radio"
									name="checklist"
									value="Review Pull Requests"
									checked={selectedTask === "Review Pull Requests"}
									onChange={handleRadioChange}
								/>
								<p>Assessed on site</p>
							</div>
						</div>
					</form>
				</div>
				<div className="module9 individual_case_modules">
					<h3>Documentation:</h3>
				</div>
			</div>
		</div>
	);
}

export default Case;
