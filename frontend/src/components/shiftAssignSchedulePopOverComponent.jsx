// CSS Import
import "../componentStyling/shiftCalendar.css";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

async function readJsonResponse(response, resourceName) {
	if (!response.headers.get("content-type")?.includes("application/json")) {
		throw new Error(
			`Unable to load ${resourceName} (${response.status}). The API returned a non-JSON response; check that the backend is running and restarted.`,
		);
	}

	return response.json();
}

function ShiftSchedulePopUpComponent({ shift, onClose, onAssigned }) {
	const [token] = useState(() => localStorage.getItem("authToken"));
	const [volunteers, setVolunteers] = useState([]);
	const [enclosures, setEnclosures] = useState([]);
	const [selectedVolunteer, setSelectedVolunteer] = useState("");
	const [selectedEnclosure, setSelectedEnclosure] = useState("");
	const [isLoadingChoices, setIsLoadingChoices] = useState(Boolean(token));
	const [choicesError, setChoicesError] = useState("");
	const [isAssigning, setIsAssigning] = useState(false);
	const [assignmentError, setAssignmentError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		if (!token) {
			return () => controller.abort();
		}

		const loadChoices = async () => {
			try {
				const headers = { Authorization: `Bearer ${token}` };
				const [volunteerResponse, enclosureResponse] = await Promise.all([
					fetch("/api/volunteers", {
						headers,
						signal: controller.signal,
					}),
					fetch("/api/enclosures", { signal: controller.signal }),
				]);
				const [volunteerResult, enclosureResult] = await Promise.all([
					readJsonResponse(volunteerResponse, "volunteers"),
					readJsonResponse(enclosureResponse, "enclosures"),
				]);

				if (!volunteerResponse.ok) {
					throw new Error(
						volunteerResult.message ||
							`Unable to load volunteers (${volunteerResponse.status}).`,
					);
				}
				if (!enclosureResponse.ok) {
					throw new Error(
						enclosureResult.message ||
							`Unable to load enclosures (${enclosureResponse.status}).`,
					);
				}
				if (!Array.isArray(volunteerResult) || !Array.isArray(enclosureResult)) {
					throw new Error("The server returned invalid dropdown data.");
				}

				setVolunteers(volunteerResult);
				setEnclosures(enclosureResult);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setChoicesError(fetchError.message || "Unable to load choices.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoadingChoices(false);
				}
			}
		};

		loadChoices();
		return () => controller.abort();
	}, [token]);

	const errorMessage =
		choicesError ||
		(!token ? "You must be logged in to load volunteer choices." : "");
	const handleAssign = async () => {
		if (!shift?._id || !selectedVolunteer || !selectedEnclosure) {
			setAssignmentError("Select a volunteer and enclosure before assigning.");
			return;
		}

		setIsAssigning(true);
		setAssignmentError("");
		try {
			const response = await fetch(`/api/shifts/${shift._id}/assign`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					volunteerId: selectedVolunteer,
					enclosure: selectedEnclosure,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || `Unable to assign volunteer (${response.status}).`,
				);
			}

			onAssigned(result);
		} catch (assignError) {
			setAssignmentError(assignError.message || "Unable to assign volunteer.");
		} finally {
			setIsAssigning(false);
		}
	};

	return (
		<div className="shift_schedule_popup_overlay" onClick={onClose}>
			<div
				className="shift_schedule_popup"
				role="dialog"
				aria-modal="true"
				aria-labelledby="shift-schedule-title"
				onClick={(event) => event.stopPropagation()}>
				<div className="schedule_title_bar">
					<div className="schedule_title_left">
						<h3 id="shift-schedule-title">Assign to Shift</h3>
						<p>Assign a volunteer to work a shift</p>
					</div>
					<button
						className="close_popup_btn"
						id="close_popup_button"
						type="button"
						onClick={onClose}
						aria-label="Close assign shift dialog">
						<X />
					</button>
				</div>
				<div className="shift_schedule_popup_choices">
					<div className="volunteer_select">
						<p>Select Volunteer</p>
						{/* volunteer select dropdown */}
						<select
							className="assign_shifts_dropdown_selector"
							id="assign_select_volunteer_selector"
							value={selectedVolunteer}
							onChange={(event) =>
								setSelectedVolunteer(event.currentTarget.value)
							}
							disabled={isLoadingChoices || Boolean(errorMessage)}>
							<option value="" disabled>
								{isLoadingChoices ? "Loading volunteers..." : "Volunteers..."}
							</option>
							{volunteers.map((volunteer) => (
								<option key={volunteer._id} value={volunteer._id}>
									{volunteer.name}
								</option>
							))}
						</select>
					</div>
					<div className="enclosure_select">
						<p>Select Enclosure</p>
						{/* enclosure select dropdown*/}
						<select
							className="assign_enclosure_dropdown_selector"
							id="assign_select_enclosure_selector"
							value={selectedEnclosure}
							onChange={(event) =>
								setSelectedEnclosure(event.currentTarget.value)
							}
							disabled={isLoadingChoices || Boolean(errorMessage)}>
							<option value="" disabled>
								{isLoadingChoices ? "Loading enclosures..." : "Enclosures..."}
							</option>
							{enclosures.map((enclosure) => (
								<option key={enclosure._id} value={enclosure.name}>
									{enclosure.name}
								</option>
							))}
						</select>
					</div>
					<div className="assigned_shift_display">
						<p>
							{shift
								? `${shift.date} · ${shift.startTime} - ${shift.endTime}`
								: "No shift selected"}
						</p>
					</div>
				</div>
				{errorMessage && <p role="alert">{errorMessage}</p>}
				{assignmentError && <p role="alert">{assignmentError}</p>}
				{!isLoadingChoices &&
					!errorMessage &&
					volunteers.length === 0 && <p>No volunteers are available.</p>}
				{!isLoadingChoices &&
					!errorMessage &&
					enclosures.length === 0 && (
						<p>No enclosures are available in the database.</p>
					)}
				<div className="assign_shift_actions">
					<button
						className="assign_to_shift_btn"
						id="assign_to_shift_btn"
						type="button"
						onClick={handleAssign}
						disabled={
							isLoadingChoices ||
							Boolean(errorMessage) ||
							isAssigning ||
							!shift
						}>
						<p>{isAssigning ? "Assigning..." : "+ Assign To Shift"}</p>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ShiftSchedulePopUpComponent;
