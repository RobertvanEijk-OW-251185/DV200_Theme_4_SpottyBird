// CSS Import
import "../pagesStyling/Rehabilitation.css";
import { Search } from "lucide-react";

// Component Import
import RehabListCard from "./rehabilitationListCard";

function RehabilitationComponent({ cases, isLoading, error }) {
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
						defaultValue=""
					/>
				</div>
			</div>
			<div className="rehab_list_cards">
				{isLoading && <p>Loading rehabilitation cases...</p>}
				{!isLoading && error && <p role="alert">{error}</p>}
				{!isLoading && !error && cases.length === 0 && (
					<p>No rehabilitation cases found.</p>
				)}
				{!isLoading &&
					!error &&
					cases.map((caseRecord) => (
						<RehabListCard key={caseRecord._id} caseRecord={caseRecord} />
					))}
			</div>
		</div>
	);
}

export default RehabilitationComponent;
