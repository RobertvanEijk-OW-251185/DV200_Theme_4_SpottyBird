// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/CaseIndividual.css";

// React imports
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

// icon import
import {
	Download,
	Image,
	Unlink,
	ShieldPlus,
	FilePenLine,
	BriefcasePlus,
} from "lucide-react";

// case data functions

const displayValue = (value) =>
	value === null || value === undefined || value === "" ? "—" : value;

const formatLabel = (value) =>
	typeof value === "string"
		? value
				.replaceAll("_", " ")
				.replace(/\b\w/g, (letter) => letter.toUpperCase())
		: "—";

const formatDate = (value) => {
	if (!value) return "—";

	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "—"
		: new Intl.DateTimeFormat(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			}).format(date);
};

const formatFileSize = (size) =>
	size < 1024 * 1024
		? `${Math.max(1, Math.round(size / 1024))} KB`
		: `${(size / (1024 * 1024)).toFixed(1)} MB`;

function Case() {
	const [caseRecord, setCaseRecord] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [actionFeedback, setActionFeedback] = useState("");
	const [error, setError] = useState("");
	const { id } = useParams();
	const navigate = useNavigate();
	const attachments = caseRecord?.attachments ?? [];
	const imageAttachments = attachments.filter((file) =>
		file.mimeType?.startsWith("image/"),
	);
	const documentAttachments = attachments.filter(
		(file) => !file.mimeType?.startsWith("image/"),
	);
	const attachmentUrl = (file, download = false) =>
		`/api/cases/${caseRecord._id}/files/${encodeURIComponent(file.id)}${download ? "?download=1" : ""}`;

	const updateStatus = async (status, successMessage) => {
		setIsUpdating(true);
		setActionFeedback("");

		try {
			const response = await fetch(`/api/cases/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || `Request failed (${response.status}).`,
				);
			}

			setCaseRecord(result);
			setActionFeedback(successMessage);
		} catch (updateError) {
			setActionFeedback(updateError.message || "Unable to update this case.");
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		const controller = new AbortController();

		const loadCase = async () => {
			setIsLoading(true);
			setError("");

			try {
				const response = await fetch(`/api/cases/${id}`, {
					signal: controller.signal,
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message ||
							(response.status === 404
								? "Case not found"
								: `Request failed ${response.status}`),
					);
				}

				setCaseRecord(result);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(fetchError.message || "Unable to load this case");
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		loadCase();

		return () => controller.abort();
	}, [id]);

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Case Details"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
			{isLoading ? (
				<p role="status">Loading case...</p>
			) : error ? (
				<p role="alert">{error}</p>
			) : !caseRecord ? (
				<p role="alert">Case not found.</p>
			) : (
				<div className="individual_case_content_grid">
					<div className="case_info_card individual_case_modules">
						{imageAttachments[0] ? (
							<img
								className="case_animal_image"
								src={attachmentUrl(imageAttachments[0])}
								alt={caseRecord.animal?.species || "Animal"}
							/>
						) : (
							<div className="case_animal_image" aria-hidden="true"></div>
						)}
						<div className="animal_info_text">
							<div className="info_text_animal">
								<h3>{displayValue(caseRecord.caseNumber)}</h3>
								<div className="priority_tags">
									<p>{formatLabel(caseRecord.priority)}</p>
									<p>{formatLabel(caseRecord.status)}</p>
								</div>
							</div>
							<div className="case_assigned_info">
								<div className="animal_names">
									<h3>{displayValue(caseRecord.animal?.species)}</h3>
									<p>{displayValue(caseRecord.animal?.scientificName)}</p>
								</div>
								<div className="report_info">
									<div className="report">
										{/* icon */}
										<div className="report_text">
											<h3>Reported:</h3>
											<p>{formatDate(caseRecord.finder?.reportedAt)}</p>
										</div>
									</div>
									<div className="location">
										{/* icon */}
										<div className="report_text">
											<h3>Location:</h3>
											<p>
												{" "}
												{displayValue(
													caseRecord.incident?.locationName ||
														caseRecord.incident?.address,
												)}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="case_assignee">
								<h3>Assigned To:</h3>
								<h3>
									{" "}
									{displayValue(
										caseRecord.assignment?.assignedVolunteer?.name ||
											caseRecord.assignment?.assignedTo?.username ||
											caseRecord.assignment?.assignedTo?.email,
									)}
								</h3>
							</div>
						</div>
					</div>
					<div className="quick_actions individual_case_modules">
						<div className="qa_a">
							<h3>Quick Actions:</h3>
							<div className="quick_actions_buttons">
								<button
									className="qas_btn"
									type="button"
									disabled={isUpdating}
									onClick={() =>
										updateStatus("release_ready", "Animal marked for release.")
									}>
									<Unlink />
									{isUpdating ? "Updating..." : "Mark for Release"}
								</button>
								<button
									className="qas_btn"
									type="button"
									disabled={isUpdating}
									onClick={() =>
										updateStatus("in_care", "Animal marked for rehabilitation.")
									}>
									<ShieldPlus />
									{isUpdating ? "Updating..." : "To Rehab"}
								</button>
								<button
									className="qas_btn"
									type="button"
									onClick={() => navigate(`/admissions?caseId=${id}`)}>
									<FilePenLine />
									Edit Case Details
								</button>
							</div>
							{actionFeedback && <p role="status">{actionFeedback}</p>}
						</div>
						<div className="qa_ps">
							<h3>Photos:</h3>
							<div className="photos_container">
								{imageAttachments.length ? (
									imageAttachments.map((file) => (
										<div className="photo_download_item" key={file.id}>
											<div className="photo_container_info_left">
												<div className="photo_icon">
													<Image color="#b4b4b4" />
												</div>
												<div className="photo_text">
													<p>{file.originalName}</p>
													<p>{formatFileSize(file.size)}</p>
												</div>
											</div>
											<a
												className="download_documents"
												href={attachmentUrl(file, true)}
												aria-label={`Download ${file.originalName}`}>
												<Download />
											</a>
										</div>
									))
								) : (
									<p>No photos attached.</p>
								)}
							</div>
						</div>
						<div className="qa_ds">
							<h3>Documentation:</h3>
							<div className="download_document_container">
								{documentAttachments.length ? (
									documentAttachments.map((file) => (
										<div className="document_load" key={file.id}>
											<div className="document_container_left">
												<div className="pdf_icon">
													<p>{file.originalName.split(".").pop()}</p>
												</div>
												<div className="document_export_info">
													<p>{file.originalName}</p>
													<p>{formatFileSize(file.size)}</p>
												</div>
											</div>
											<a
												className="download_documents"
												href={attachmentUrl(file, true)}
												aria-label={`Download ${file.originalName}`}>
												<Download />
											</a>
										</div>
									))
								) : (
									<p>No documents attached.</p>
								)}
							</div>
						</div>
					</div>

					<div className="incident_description individual_case_modules">
						<div className="i_d">
							<h3>Incident Description:</h3>
							<div className="descriptions">
								<p>{displayValue(caseRecord.incident?.description)}</p>

								<p>Note : {displayValue(caseRecord.admissionNotes)}</p>
							</div>
						</div>
						<div className="i_c">
							<div className="condition_description">
								<h3>Condition:</h3>
								<p>{displayValue(caseRecord.incident?.description)}</p>
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
										<p>
											{" "}
											{caseRecord.clinical?.temperatureCelsius == null
												? "—"
												: `${caseRecord.clinical.temperatureCelsius} °C`}
										</p>
									</div>
									<div className="vitals_info_row">
										<p>Heart Rate:</p>
										<p>{displayValue(caseRecord.clinical?.heartRateBpm)} bpm</p>
									</div>
								</div>
							</div>
						</div>
						<div className="c_d">
							<h3>Case Details:</h3>
							<div className="case_det_information">
								<div className="cd_info_left">
									<div className="left_info_line">
										<p className="cd_info_title">Animal Type:</p>
										<p>{formatLabel(caseRecord.animal?.type)}</p>
									</div>
									<div className="left_info_line">
										<p className="cd_info_title">Age / Life Stage:</p>
										<p>{displayValue(caseRecord.animal?.lifeStage)}</p>
									</div>
									<div className="left_info_line">
										<p className="cd_info_title">Sex (if known):</p>
										<p>{formatLabel(caseRecord.animal?.sex)}</p>
									</div>
									<div className="left_info_line">
										<p className="cd_info_title">Weight (if known):</p>
										<p>
											{caseRecord.clinical?.weight?.value == null
												? "—"
												: `${caseRecord.clinical.weight.value}${caseRecord.clinical.weight.unit ? ` ${caseRecord.clinical.weight.unit}` : ""}`}
										</p>
									</div>
									<div className="left_info_line">
										<p className="cd_info_title">Microchip / ID:</p>
										<p>{displayValue(caseRecord.animal?.microchipId)}</p>
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
										<p>{formatDate(caseRecord.incident?.foundAt)}</p>
									</div>
									<div className="right_info_line">
										<p className="cd_info_title">Found By:</p>
										<p>{displayValue(caseRecord.finder?.name)}</p>
									</div>
									<div className="right_info_line">
										<p className="cd_info_title">Weather Conditions:</p>
										<p>{displayValue(caseRecord.incident?.weather)}</p>
									</div>
									<div className="right_info_line">
										<p className="cd_info_title">Other Animals Involved:</p>
										<p>abcd</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Case;
