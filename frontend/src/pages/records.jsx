// CSS Import
import "../pagesStyling/MainContent.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Records() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Case Records"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
		</div>
	);
}

export default Records;
