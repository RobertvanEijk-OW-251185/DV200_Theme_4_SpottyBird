// CSS Import
import "../pagesStyling/Rehabilitation.css";
import { ChartColumn } from "lucide-react";

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

	const assignedTo = caseRecord.assignment?.assignedTo;
	const assignee =
		typeof assignedTo === "string"
			? assignedTo
			: assignedTo?.username || assignedTo?.email || "Unassigned";

	return (
		<div className="rehabilitation_list_card">
			<div className="case_image"></div>
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
				<button className="open_case_details">
					<ChartColumn />
					Open Case Details
				</button>
			</div>
		</div>
	);
}

export default RehabListCard;
