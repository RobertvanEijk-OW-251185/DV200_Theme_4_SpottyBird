// Import CSS
import "../componentStyling/returnPublic.css";

// import icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faGlobe } from "@fortawesome/free-solid-svg-icons";

function ReturnToPublic() {
	return (
		<a
			className="return_to_public_container"
			href="https://www.spottybirdwrc.org.za/">
			<div className="return_public">
				<FontAwesomeIcon icon={faGlobe} />
				<h3 className="return_to_public_text">Return To Public</h3>
			</div>
			<FontAwesomeIcon icon={faChevronRight} />
		</a>
	);
}

export default ReturnToPublic;
