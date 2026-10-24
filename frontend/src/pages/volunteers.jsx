// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Volunteers.css";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";

// icon import
import { Target, ListTodo, ContactRound, CirclePlus } from "lucide-react";

function Volunteers() {
	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Volunteers"
				description="Admissions, rehabilitation performance and case outcomes at a glance."
				prevPage=""
			/>

			<div className="volunteer_schedule_container">
				<div className="volunteer_info_modules">
					<div className="info_module module_style">
						<div className="target_icon">
							<Target />
						</div>
						<div className="info_text">
							<h3>32</h3>
							<h3>Scheduled</h3>
							<p>jslka</p>
						</div>
					</div>
					<div className="info_module module_style">
						<div className="shifts_icon">
							<ListTodo />
						</div>
						<div className="info_text">
							<h3>32</h3>
							<h3>Scheduled</h3>
							<p>jslka</p>
						</div>
					</div>
					<div className="info_module module_style">
						<div className="availability_icon">
							<ContactRound />
						</div>
						<div className="info_text">
							<h3>32</h3>
							<h3>Scheduled</h3>
							<p>jslka</p>
						</div>
					</div>
				</div>
				<div className="volunteer_contact_module module_style">
					<div className="vol_contact_title_section">
						<h3>Contact</h3>
						<button className="add_person_btn">
							<CirclePlus />
							<p>Add Contact</p>
						</button>
					</div>
					<div className="contact_actions">
						<select className="dropdown_date">
							<option value="fuck">uhh</option>
						</select>
						<input
							className="search_people"
							placeholder="Search Contact..."></input>
						<div className="filter_options">
							<button className="filter_btn filter_btn_active">
								<p>All</p>
							</button>
							<button className="filter_btn">
								<p>Available</p>
							</button>
							<button className="filter_btn">
								<p>Working</p>
							</button>
							<button className="filter_btn">
								<p>Away</p>
							</button>
						</div>
					</div>
					<div className="people_list">
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
						<div className="contact_person">
							<div className="contact_icon">
								<p>SJ</p>
							</div>
							<div className="contact_person_information">
								<h3>Name</h3>
								<p>Role</p>
							</div>
							<div className="contact_person_availability">
								<div className="available_tag">
									<p>Available</p>
								</div>
								<p>08:00 - 16:00</p>
							</div>
						</div>
					</div>
				</div>
				<div className="volunteer_calendar module_style"></div>
			</div>
		</div>
	);
}

export default Volunteers;
