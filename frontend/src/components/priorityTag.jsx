import "../componentStyling/priorityTag.css";

const priorities = new Set(["urgent", "high", "medium", "low"]);

function PriorityTag({ priority }) {
	const normalizedPriority =
		typeof priority === "string" ? priority.trim().toLowerCase() : "";
	const label = normalizedPriority
		? normalizedPriority.replace(/\b\w/g, (letter) => letter.toUpperCase())
		: "—";
	const priorityClass = priorities.has(normalizedPriority)
		? normalizedPriority
		: "";

	return (
		<div className={`priority_tag${priorityClass ? ` ${priorityClass}` : ""}`}>
			{label}
		</div>
	);
}

export default PriorityTag;
