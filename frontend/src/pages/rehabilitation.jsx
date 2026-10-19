// CSS Import
import "../pagesStyling/MainContent.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Rehabilitation() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Rehabilitation"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
		</div>
	);
}

export default Rehabilitation;
