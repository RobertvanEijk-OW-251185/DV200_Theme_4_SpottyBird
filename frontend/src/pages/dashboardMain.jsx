// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Main.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import OverviewCardComponent from "../components/mdOverviewCards";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function MainDash() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Admissions & Insights"
				description="Admissions, rehabilitation performance and case outcomes at a glance."
				prevPage=""
			/>
			<div className="main_dash_filters">
				<div className="md_filters_self"></div>
			</div>
			<div className="main_dash_module_grid">
				<OverviewCardComponent
					className="grid_module_test"
					title="New Reports"
					numb="18"
					extraInfo="+6 From Yesterday"
				/>
				<OverviewCardComponent
					className="grid_module_test2"
					title="Urgent"
					numb="4"
					extraInfo="Requires Attention"
				/>
				<OverviewCardComponent
					className="grid_module_test3"
					title="Info Pending"
					numb="6"
					extraInfo="+6 Needs Response"
				/>
				<OverviewCardComponent
					className="grid_module_test4"
					title="In Rehab"
					numb="18"
					extraInfo="+5 This Week"
				/>
				<div className="grid_module_test5">
					<p>hi</p>
				</div>
				<div className="grid_module_test6">
					<p>hi</p>
				</div>
				<div className="grid_module_test7">
					<p>hi</p>
				</div>
				<div className="grid_module_test8">
					<p>hi</p>
				</div>
			</div>
		</div>
	);
}

export default MainDash;
