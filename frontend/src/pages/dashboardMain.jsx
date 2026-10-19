// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Main.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import OverviewCardComponent from "../components/mdOverviewCards";
import BarChartCardModuleComponent from "../components/mdBarChartCard";

// Import Font Awesome icons
import {
	faCircleInfo,
	faFileCirclePlus,
	faSuitcaseMedical,
	faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

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
					icon={faFileCirclePlus}
					iconColor="#16803c"
					iconBackgroundColor="#e6f4ea"
				/>
				<OverviewCardComponent
					className="grid_module_test2"
					title="Urgent"
					numb="4"
					extraInfo="Requires Attention"
					icon={faTriangleExclamation}
					iconColor="#b42318"
					iconBackgroundColor="#fdecea"
				/>
				<OverviewCardComponent
					className="grid_module_test3"
					title="Info Pending"
					numb="6"
					extraInfo="+6 Needs Response"
					icon={faCircleInfo}
					iconColor="#175cd3"
					iconBackgroundColor="#eff8ff"
				/>
				<OverviewCardComponent
					className="grid_module_test4"
					title="In Rehab"
					numb="18"
					extraInfo="+5 This Week"
					icon={faSuitcaseMedical}
					iconColor="#6941c6"
					iconBackgroundColor="#f4f3ff"
				/>
				<BarChartCardModuleComponent
					className="grid_module_test5"
					title="Cases by workflow stage"
					subtitle="Current distribution across the case lifecycle"
					colors={["#46B450", "#004A59", "#611B1B", "#5F3F7E", "#0B2E22"]}
				/>
				{/* <div className="grid_module_test5">
					<p>hi</p>
				</div> */}
				<div className="grid_module_test6">
					<p>Doughnut Chart</p>
				</div>
				<div className="grid_module_test7">
					<p>Line Graph</p>
				</div>
				<div className="grid_module_test8">
					<p>Horisontal Bar type thingy </p>
				</div>
			</div>
		</div>
	);
}

export default MainDash;
