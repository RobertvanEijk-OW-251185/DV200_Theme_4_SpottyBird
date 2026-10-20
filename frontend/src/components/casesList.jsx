import "../componentStyling/casesList.css";
import PriorityTag from "./priorityTag";
import CaseStatusTag from "./caseStatusTag";

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
			}).format(date);
};

const formatAnimal = (animal = {}) => {
	const type = formatLabel(animal.type);
	return animal.species
		? `${type === "—" ? "" : `${type} - `}${animal.species}`
		: type;
};

const getAssignee = (assignment) => {
	const assignedTo = assignment?.assignedTo;
	if (typeof assignedTo === "string") return assignedTo;
	return assignedTo?.username || assignedTo?.email || "Unassigned";
};

function CasesListComponent({ cases = [], isLoading = false, error = "" }) {
	return (
		<table className="cases_table">
			<thead className="cases_table_head">
				<tr className="cases_table_row">
					<th className="table_head_title" scope="col">
						Case ID
					</th>
					<th className="table_head_title" scope="col">
						Animal
					</th>
					<th className="table_head_title" scope="col">
						Location
					</th>
					<th className="table_head_title" scope="col">
						Priority
					</th>
					<th className="table_head_title" scope="col">
						Condition
					</th>
					<th className="table_head_title" scope="col">
						Assigned To
					</th>
					<th className="table_head_title" scope="col">
						Updated
					</th>
					<th className="table_head_title" scope="col">
						State
					</th>
					<th className="table_head_title" scope="col">
						Report
					</th>
				</tr>
			</thead>

			<tbody className="cases_table_body">
				{isLoading && (
					<tr className="cases_table_row">
						<td className="table_row_content" colSpan="9">
							Loading cases...
						</td>
					</tr>
				)}
				{!isLoading && error && (
					<tr className="cases_table_row">
						<td className="table_row_content" colSpan="9" role="alert">
							{error}
						</td>
					</tr>
				)}
				{!isLoading && !error && cases.length === 0 && (
					<tr className="cases_table_row">
						<td className="table_row_content" colSpan="9">
							No cases match these filters.
						</td>
					</tr>
				)}
				{!isLoading &&
					!error &&
					cases.map((caseRecord) => (
						<tr className="cases_table_row" key={caseRecord._id}>
							<td className="case-id table_row_content">
								{caseRecord.caseNumber || caseRecord._id}
							</td>
							<td className="animal-cell table_row_content">
								{formatAnimal(caseRecord.animal)}
							</td>
							<td className="location-cell table_row_content">
								{caseRecord.incident?.locationName ||
									caseRecord.incident?.address ||
									"—"}
							</td>
							<td className="table_row_content">
								<PriorityTag priority={caseRecord.priority} />
							</td>
							<td className="table_row_content">
								<CaseStatusTag status={caseRecord.status} />
							</td>
							<td className="assigned_to table_row_content">
								{getAssignee(caseRecord.assignment)}
							</td>
							<td className="updated-cell table_row_content">
								{formatDate(caseRecord.updatedAt || caseRecord.createdAt)}
							</td>
							<td className="table_row_content">
								{formatLabel(caseRecord.completionStatus)}
							</td>
							<td className="table_row_content">
								{/* Temp, add button to take to the specific case's page */}
								<button id="open_report_btn" className="open_report_btn">
									Open Report
								</button>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
}

export default CasesListComponent;
