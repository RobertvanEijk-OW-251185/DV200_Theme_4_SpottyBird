// CSS Import
import "../componentStyling/pageHeader.css";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function PageHeaderComponent() {
	return (
		<div className="page_title_container">
			<div className="page_title_block">
				<h3>Page Title</h3>
				<p>Page functional description</p>
				<div className="page_back">
					<FontAwesomeIcon icon={faChevronLeft} />
					<p>Back To ____</p>
				</div>
			</div>
			<div className="user_container">
				<div className="notifications"></div>
				<div className="divider_vertical"></div>
				<div className="user_account">
					<div className="user_profile_image"></div>
					<div className="user_account_info">
						<h3>Username</h3>
						<p>User's title</p>
					</div>
					<button className="view_user_info_dropdown">
						<FontAwesomeIcon icon={faChevronRight} />
						{/* <FontAwesomeIcon icon={faChevronDown} /> */}
					</button>
				</div>
			</div>
		</div>
	);
}

export default PageHeaderComponent;
