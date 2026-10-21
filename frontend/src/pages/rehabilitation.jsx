// CSS Import
import "../pagesStyling/MainContent.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import RehabilitationComponent from "../components/rehabList";

function Rehabilitation() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Rehabilitation"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
			<div className="rehab_info_modules">
				<div className="module1">salkdja</div>
				<div className="module1">salkdja</div>
				<div className="module1">salkdja</div>
				<div className="module1">salkdja</div>
			</div>
			<RehabilitationComponent />
		</div>
	);
}

export default Rehabilitation;
