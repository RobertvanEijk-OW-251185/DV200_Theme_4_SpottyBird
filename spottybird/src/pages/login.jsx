// CSS Import
import "../pagesStyling/Login.css";

// Component Imports
import EmailInput from "../components/emailInput";
import PasswordInput from "../components/passwordInput";
import ReturnToPublic from "../components/returnToPublic";

// Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserShield,
	faCloudArrowUp,
	faLock,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function LogInPage() {
	return (
		<div className="login_body">
			<div className="hero_image">
				<div className="topContent">
					<div className="spotty_bird_logo1"></div>
					<h1 className="hero_text1">Every rescue makes a difference.</h1>
					<h3 className="hero_subtext1">
						The secure platform for managing wildlife reports, admissions,
						rehabilitation, and conservation outcomes.
					</h3>
				</div>
				<div className="extra_info">
					<div className="info_shield">
						<FontAwesomeIcon icon={faUserShield} />
						<p>Secure & Private</p>
					</div>
					<div className="circle_thing"></div>
					<div className="info_cloud">
						<FontAwesomeIcon icon={faCloudArrowUp} />
						<p>Backed up daily</p>
					</div>
					<div className="circle_thing"></div>
					<div className="info_lock">
						<FontAwesomeIcon icon={faLock} />
						<p>Role-based access</p>
					</div>
				</div>
			</div>
			<div className="content_right">
				<div>
					{/* Top Right thing */}
					<ReturnToPublic></ReturnToPublic>
				</div>
				<div className="login_stuff">
					<div className="login_head">
						<h1 className="welcome_label">Welcome Back</h1>
						<div className="welcome_subtext">
							<p className="login_welcome_subtext">
								Log in to access the Spotty Bird portal.
							</p>
							<p className="login_welcome_subtext2">
								Secure. Trusted. Built for conservation.
							</p>
						</div>
					</div>
					<div className="login_field">
						{/* input field 1: Email Component*/}
						<EmailInput></EmailInput>
						{/* input field 2: Password Component*/}
						<PasswordInput></PasswordInput>
						<div className="forgor_password">
							<a className="forgotPassword" rel="stylesheet" href="">
								Forgot password?
							</a>
						</div>
					</div>
					<div className="user_info">
						<FontAwesomeIcon
							className="user_shield_icon1"
							icon={faUserShield}
						/>
						<div className="user_info2">
							<p className="info_users_bold">
								For staff, interns, admins, and volunteers only.
							</p>
							<p className="info_users">
								Use your organisation email to sign in.
							</p>
						</div>
					</div>
					<div className="login_redirect_buttons">
						{/* login component */}
						<button className="login_btn" id="loginBtn">
							<FontAwesomeIcon icon={faLock} />
							<h2>Log In</h2>
						</button>
						<div className="divide_line_or">
							<div className="divide_line"></div>
							<p>or</p>
							<div className="divide_line"></div>
						</div>
						{/* Report on whatsapp component */}
						<button className="report_whatsapp_redirect">
							<FontAwesomeIcon
								className="whatsapp_icon_login"
								icon={faWhatsapp}
							/>
							<div className="buttonText">
								<h2 className="whatsapp_redirect_btn_text">Found wildlife?</h2>
								<h2 className="whatsapp_redirect_btn_text_bold">
									Report on WhatsApp
								</h2>
							</div>
							<FontAwesomeIcon icon={faChevronRight} />
						</button>
					</div>
					<div className="final_info_right">
						<FontAwesomeIcon className="privacy_info_lock" icon={faLock} />
						<div className="final_info_right_text">
							<p className="privacy_text">
								Your data is encrypted and protected.
							</p>
							<p className="privacy_text">
								By logging in, you agree to our Terms of Use and Privacy Policy.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LogInPage;
