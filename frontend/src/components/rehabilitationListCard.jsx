// CSS Import
import "../pagesStyling/Rehabilitation.css";
import { ChartColumn } from "lucide-react";

// Component Import

function RehabListCard() {
	return (
		<div className="rehabilitation_list_card">
			<div className="case_image"></div>
			<div className="case_details">
				<div className="case_animal_names">
					<h3>Animal Name</h3>
					<p>Scientific Name</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Assigned:</h3>
					<p className="rehab_list_info">aslkdjas</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Enclsoure:</h3>
					<p className="rehab_list_info">aslkdjas</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Release Date:</h3>
					<p className="rehab_list_info">aslkdjas</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Status:</h3>
					<p className="rehab_list_info">aslkdjas</p>
				</div>
				<div className="case_details_information">
					<h3 className="rehab_list_title">Actions:</h3>
					<p className="rehab_list_info">aslkdjas</p>
				</div>
				<button className="open_case_details">
					<ChartColumn />
					Open Case Details
				</button>
			</div>
		</div>
	);
}

export default RehabListCard;
