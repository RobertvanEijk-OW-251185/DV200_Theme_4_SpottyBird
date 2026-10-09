// CSS Import
import "../pagesStyling/MainContent.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Cases() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Cases List"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
		</div>
	);
}

export default Cases;
