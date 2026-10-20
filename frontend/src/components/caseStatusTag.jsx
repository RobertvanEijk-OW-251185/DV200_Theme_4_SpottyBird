import "../componentStyling/caseStatusTag.css";

const statusLabels = {
	new_report: "New report",
	assessment: "Assessment",
	in_care: "In care",
	release_ready: "Release ready",
	closed: "Closed",
};

function CaseStatusTag({ status }) {
	const normalizedStatus =
		typeof status === "string" ? status.trim().toLowerCase() : "";
	const isKnownStatus = Object.hasOwn(statusLabels, normalizedStatus);
	const label = isKnownStatus
		? statusLabels[normalizedStatus]
		: normalizedStatus
			? normalizedStatus
					.replaceAll("_", " ")
					.replace(/\b\w/g, (letter) => letter.toUpperCase())
			: "—";
	const statusClass = isKnownStatus ? normalizedStatus : "";

	return (
		<div className={`status_tag${statusClass ? ` ${statusClass}` : ""}`}>
			{label}
		</div>
	);
}

export default CaseStatusTag;
