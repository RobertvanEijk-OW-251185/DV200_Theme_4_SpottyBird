import { Link, useLocation } from "react-router-dom";

function Navbar() {
	const location = useLocation();

	return (
		<>
			<nav className="custom-navbar">
				<div className="nav-container">
					<div className="nav-menu">
						<div className="nav-links">
							<Link
								to="/"
								className={location.pathname === "/" ? "active" : ""}>
								Login
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}

export default Navbar;
