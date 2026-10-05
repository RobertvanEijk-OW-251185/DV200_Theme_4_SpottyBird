// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Main.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function MainDash() {
	return (
		<div className="main_content">
			<PageHeaderComponent />
		</div>
	);
}

export default MainDash;
