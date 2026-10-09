// CSS Import
import "../componentStyling/mdOverviewCards.css";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

function OverviewCardComponent({
	className = "",
	iconClassName = "",
	title,
	numb,
	extraInfo,
}) {
	return (
		<div className={`overview_card ${className}`}>
			<div className={`overview_card_icon ${iconClassName}`}>
				<FontAwesomeIcon
					className="green_module_icon"
					icon={faFileCirclePlus}
				/>
			</div>
			<div className="overview_module_text">
				<h3>{title}</h3>
				<h1 className="numb">{numb}</h1>
				<p>{extraInfo}</p>
			</div>
		</div>
	);
}

export default OverviewCardComponent;
