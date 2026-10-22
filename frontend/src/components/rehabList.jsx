// CSS Import
import "../pagesStyling/Rehabilitation.css";
import { Search } from "lucide-react";

// React imports
import { useState } from "react";

// Component Import
import RehabListCard from "./rehabilitationListCard";

function RehabilitationComponent({ cases, isLoading, error }) {
	const [searchTerm, setSearchTerm] = useState("");
	const normalizedSearch = searchTerm.trim().toLowerCase();

	const filteredCases = cases.filter((caseRecord) => {
		const assignedTo = caseRecord.assignment?.assignedTo;
		const assignee =
			typeof assignedTo === "string"
				? assignedTo
				: `${assignedTo?.username || ""} ${assignedTo?.email || ""}`;

		const searchableText = [
			caseRecord.caseNumber,
			caseRecord.animal?.species,
			caseRecord.animal?.scientificName,
			caseRecord.clinical?.enclosure,
			caseRecord.status,
			caseRecord.careTasks,
			assignee,
		]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		return searchableText.includes(normalizedSearch);
	});

	return (
		<div className="rehabilitation_list">
			<div className="rehab_title_search">
				<h3>Rehabilitation</h3>
				<div className="rehab_search_wrapper">
					<Search className="rehab_search_icon" color="#6969697a" />
					<input
						className="rehab_search_input"
						name="rehabSearch"
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>
			<div className="rehab_list_cards">
				{!isLoading && !error && cases.length === 0 && (
					<p>No rehabilitation cases found.</p>
				)}
				{!isLoading &&
					!error &&
					cases.length > 0 &&
					filteredCases.length === 0 && <p>No cases match “{searchTerm}”.</p>}
				{!isLoading &&
					!error &&
					filteredCases.map((caseRecord) => (
						<RehabListCard key={caseRecord._id} caseRecord={caseRecord} />
					))}
			</div>
		</div>
	);
}

export default RehabilitationComponent;
