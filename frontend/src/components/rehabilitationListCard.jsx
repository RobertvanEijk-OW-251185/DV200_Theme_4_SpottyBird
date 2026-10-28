// CSS Import
import "../pagesStyling/Rehabilitation.css";
import { ChartColumn } from "lucide-react";

// React import
import { useNavigate } from "react-router-dom";

function RehabListCard({ caseRecord }) {
	const formatDate = (value) => {
		if (!value) return "—";

		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? "—"
			: new Intl.DateTimeFormat(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				}).format(date);
	};

	const formatLabel = (value) =>
		typeof value === "string" ? value.replaceAll("_", " ") : "—";

	const assignedTo =
		caseRecord.assignment?.assignedVolunteer ||
		caseRecord.assignment?.assignedTo;
	const assignee =
		typeof assignedTo === "string"
			? assignedTo
			: assignedTo?.name ||
				assignedTo?.username ||
				assignedTo?.email ||
				"Unassigned";
	const mainImage = caseRecord.attachments?.find((file) =>
		file.mimeType?.startsWith("image/"),
	);

	const navigate = useNavigate();

	return (
		<div className="rehabilitation_list_card">
			{mainImage ? (
				<img
					className="case_image"
					src={`/api/cases/${caseRecord._id}/files/${encodeURIComponent(mainImage.id)}`}
					alt={caseRecord.animal?.species || "Animal"}
				/>
			) : (
				<div className="case_image" aria-hidden="true"></div>
			)}
			<div className="case_details">
				<div className="case_animal_names">
					<h3>{caseRecord.animal?.species || "Unknown Species"}</h3>
					<p>{caseRecord.animal?.scientificName || "-"}</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Assigned:</h3>
					<p className="rehab_list_info">{assignee}</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Enclosure:</h3>
					<p className="rehab_list_info">{caseRecord.clinical?.enclosure}</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Release Date:</h3>
					<p className="rehab_list_info">
						{formatDate(caseRecord.releasePlan?.plannedDate)}
					</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Status:</h3>
					<p className="rehab_list_info">{formatLabel(caseRecord.status)}</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Actions:</h3>
					<p className="rehab_list_info">{caseRecord.careTasks}</p>
				</div>
				<button
					id="open_case_details"
					type="button"
					className="open_case_details"
					onClick={() => navigate(`/case/${caseRecord._id}`)}>
					<ChartColumn />
					Open Case Details
				</button>
			</div>
		</div>
	);
}

export default RehabListCard;
