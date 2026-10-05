import { NavLink } from "react-router-dom";
import "../componentStyling/navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faFolderClosed,
	faFileLines,
	faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
	faShield,
	faSuitcaseMedical,
	faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
	const handleOpenWhatsApp = () => {
		window.open(
			"https://web.whatsapp.com/send",
			"_blank",
			"noopener, noreferrer",
		);
	};

	return (
		<>
			<nav className="custom_navbar_container">
				<div className="nav_menu">
					<div className="app_Logo"></div>
					<div className="divider"></div>
					<div className="nav_links">
						<NavLink to="/main" className="navigation_element">
							<FontAwesomeIcon icon={faHouse} />
							<h2>Main</h2>
						</NavLink>
						<NavLink to="/cases" className="navigation_element">
							<FontAwesomeIcon icon={faFolderClosed} />
							<h2>Cases</h2>
						</NavLink>
						<NavLink to="/admissions" className="navigation_element">
							<FontAwesomeIcon icon={faShield} />
							<h2>Admissions</h2>
						</NavLink>
						<NavLink to="/rehabilitation" className="navigation_element">
							<FontAwesomeIcon icon={faSuitcaseMedical} />
							<h2>Rehabilitation</h2>
						</NavLink>
						<NavLink to="/records" className="navigation_element">
							<FontAwesomeIcon icon={faFileLines} />
							<h2>Records</h2>
						</NavLink>
						<NavLink to="/volunteers" className="navigation_element">
							<FontAwesomeIcon icon={faUser} />
							<h2>Volunteers</h2>
						</NavLink>
					</div>
				</div>
				<div className="divider2"></div>
				<div className="whatsapp_redirect">
					<div className="whatsapp_image"></div>
					<p className="whatsappText">WhatsApp</p>
					<button className="whatsapp_btn" onClick={handleOpenWhatsApp}>
						<p className="whatsappText">Open Whatsapp</p>
						<FontAwesomeIcon icon={faUpRightFromSquare} />
					</button>
				</div>
			</nav>
		</>
	);
}

export default Navbar;
