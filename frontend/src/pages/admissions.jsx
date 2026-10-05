// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Admissions.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

function Admissions() {
	return (
		<div className="main_content">
			<PageHeaderComponent />
			<div className="admissions_forms">
				<div className="drafts_button_container">
					<div className="left_information">
						<h3>Saved Admissions Drafts</h3>
						<p>
							Continue incomplete case records without re-entering information.
						</p>
						<p>Draft Ammount: ___</p>
					</div>
					<button className="right_btn">
						<h2>View Drafts</h2>
					</button>
				</div>
				<div className="intake_details_container"></div>
				<div className="form_container"></div>
			</div>
		</div>
	);
}

export default Admissions;
