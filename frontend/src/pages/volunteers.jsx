// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Volunteers.css";
import { addDays, format, startOfWeek } from "date-fns";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import ShiftSchedulePopUpComponent from "../components/shiftAssignSchedulePopOverComponent";
import ShiftCalendar from "../components/shiftCalendar";

// icon import
import { Target, ListTodo, ContactRound, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

function initials(name = "") {
	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("");
}

function Volunteers() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRole, setSelectedRole] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isShiftPopupOpen, setIsShiftPopupOpen] = useState(false);
	const [weekStart] = useState(() =>
		startOfWeek(new Date(), { weekStartsOn: 1 }),
	);
	const [token] = useState(() => localStorage.getItem("authToken"));
	const [volunteers, setVolunteers] = useState([]);
	const [shifts, setShifts] = useState([]);
	const [error, setError] = useState(
		token ? "" : "You must be logged in to view volunteers and shifts.",
	);
	const [loading, setLoading] = useState(Boolean(token));
	const weekStartKey = format(weekStart, "yyyy-MM-dd");
	const weekEndKey = format(addDays(weekStart, 6), "yyyy-MM-dd");

	useEffect(() => {
		const controller = new AbortController();

		if (!token) {
			return () => controller.abort();
		}

		const loadSchedule = async () => {
			try {
				const headers = { Authorization: `Bearer ${token}` };
				const [volunteerResponse, shiftResponse] = await Promise.all([
					fetch(`/api/volunteers?date=${weekStartKey}`, {
						headers,
						signal: controller.signal,
					}),
					fetch(`/api/shifts?from=${weekStartKey}&to=${weekEndKey}`, {
						headers,
						signal: controller.signal,
					}),
				]);
				const [volunteerResult, shiftResult] = await Promise.all([
					volunteerResponse.json(),
					shiftResponse.json(),
				]);

				if (!volunteerResponse.ok) {
					throw new Error(
						volunteerResult.message ||
							`Unable to load volunteers (${volunteerResponse.status}).`,
					);
				}
				if (!shiftResponse.ok) {
					throw new Error(
						shiftResult.message ||
							`Unable to load shifts (${shiftResponse.status}).`,
					);
				}
				if (!Array.isArray(volunteerResult) || !Array.isArray(shiftResult)) {
					throw new Error("The server returned invalid schedule data.");
				}

				setVolunteers(volunteerResult);
				setShifts(shiftResult);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(fetchError.message || "Unable to load schedule data.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		};

		loadSchedule();
		return () => controller.abort();
	}, [token, weekEndKey, weekStartKey]);

	const roles = [
		...new Set(volunteers.map((volunteer) => volunteer.role)),
	].sort((a, b) => a.localeCompare(b));
	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredVolunteers = volunteers.filter((volunteer) => {
		const searchFields = [
			volunteer.name,
			volunteer.role,
			volunteer.email,
			volunteer.phone,
		];
		const matchesSearch = searchFields
			.filter(Boolean)
			.some((value) => value.toLowerCase().includes(normalizedSearch));
		const matchesRole =
			selectedRole === "all" || volunteer.role === selectedRole;
		const matchesStatus =
			statusFilter === "all" || volunteer.status === statusFilter;

		return matchesSearch && matchesRole && matchesStatus;
	});
	const statusFilters = ["all", "available", "working", "away"];

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
						<button type="button" className="add_person_btn">
							<CirclePlus />
							<p>Add Contact</p>
						</button>
					</div>
					<div className="contact_actions">
						<select
							className="dropdown_date"
							aria-label="Filter volunteers by role"
							value={selectedRole}
							onChange={(event) => setSelectedRole(event.currentTarget.value)}>
							<option value="all">All roles</option>
							{roles.map((role) => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
						</select>
						<input
							type="search"
							className="search_people"
							aria-label="Search volunteers"
							placeholder="Search Contact..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.currentTarget.value)}
						/>
						<div
							className="filter_options"
							role="group"
							aria-label="Filter volunteers by status">
							{statusFilters.map((status) => (
								<button
									type="button"
									key={status}
									className={`filter_btn${statusFilter === status ? " filter_btn_active" : ""}`}
									aria-pressed={statusFilter === status}
									onClick={() => setStatusFilter(status)}>
									<p>{status[0].toUpperCase() + status.slice(1)}</p>
								</button>
							))}
						</div>
					</div>
					<div className="people_list">
						{loading && <p>Loading volunteers...</p>}
						{!loading && error && <p role="alert">{error}</p>}
						{!loading && !error && filteredVolunteers.length === 0 && (
							<p>No volunteers match your filters.</p>
						)}
						{!loading &&
							!error &&
							filteredVolunteers.map((volunteer) => (
								<div className="contact_person" key={volunteer._id}>
									<div className="contact_icon">
										<p>{initials(volunteer.name)}</p>
									</div>
									<div className="contact_person_information">
										<h3>{volunteer.name}</h3>
										<p>{volunteer.role}</p>
									</div>
									<div className="contact_person_availability">
										<div className={`volunteer_status_tag ${volunteer.status}`}>
											<p>
												{volunteer.status[0].toUpperCase() +
													volunteer.status.slice(1)}
											</p>
										</div>
										<p>
											{volunteer.availableFrom} - {volunteer.availableTo}
										</p>
									</div>
								</div>
							))}
					</div>
				</div>
				<div className="volunteer_calendar module_style">
					<div className="shift_calendar_actions">
						<div className="calendar_filtering">
							<select className="month_filter">
								<option value="type">Month</option>
							</select>
							<select className="week_filter">
								<option value="type">Week</option>
							</select>
						</div>
						{/* <button
							className="create_shift_btn"
							id="assin_to_shift_btn"
							type="button"
							onClick={() => setIsShiftPopupOpen(true)}>
							<CirclePlus />
							<p>Assign Shift</p>
						</button> */}
					</div>

					<ShiftCalendar
						weekStart={weekStart}
						shifts={shifts}
						onAssignShift={() => setIsShiftPopupOpen(true)}
					/>
				</div>
			</div>
			{isShiftPopupOpen && (
				<ShiftSchedulePopUpComponent
					onClose={() => setIsShiftPopupOpen(false)}
				/>
			)}
		</div>
	);
}

export default Volunteers;
