// CSS Import
import "../componentStyling/pageHeader.css";

// Import icons
import { LogOut } from "lucide-react";

// React imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PageHeaderComponent({ title, description, prevPage }) {
	const [username, setUsername] = useState("Loading...");

	useEffect(() => {
		const token = localStorage.getItem("authToken");

		if (!token) {
			setUsername("Username");
			return;
		}

		const fetchCurrentUser = async () => {
			try {
				const response = await fetch("/api/users/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Unable to fetch the logged in user's username");
				}

				const user = await response.json();
				setUsername(user.username || "Username");
			} catch (error) {
				console.error("Unable to load the logged in user's username...");
				setUsername("Username");
			}
		};

		fetchCurrentUser();
	}, []);

	// Logout
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		navigate("/", { replace: true });
	};

	return (
		<div className="page_title_container">
			<div className="page_title_block">
				<h3>{title}</h3>
				<p>{description}</p>
				{/* <div className="page_back">
					<FontAwesomeIcon icon={faChevronLeft} />
					<p>Back To {prevPage}</p>
				</div> */}
			</div>
			<div className="user_container">
				<div className="divider_vertical"></div>
				<div className="user_account">
					<div className="user_profile_image">
						<h2>{username.charAt(0).toUpperCase()}</h2>
					</div>
					<div className="user_account_info">
						<h3>{username}</h3>
						<p>Developer</p>
					</div>
					<button
						className="user_log_out"
						type="button"
						onClick={handleLogout}
						aria-label="Log Out">
						<LogOut />
					</button>
				</div>
			</div>
		</div>
	);
}

export default PageHeaderComponent;
