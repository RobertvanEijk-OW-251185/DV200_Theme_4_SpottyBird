// CSS Import
import "../pagesStyling/MainContent.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Volunteers() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Volunteers"
				description="Admissions, rehabilitation performance and case outcomes at a glance."
				prevPage=""
			/>
		</div>
	);
}

export default Volunteers;
