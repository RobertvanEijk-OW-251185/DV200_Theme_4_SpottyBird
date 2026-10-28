import "../componentStyling/addPersonPopUpComponent.css";
import { X } from "lucide-react";
import { useState } from "react";

function AddPersonPopupComponent({ onClose, onVolunteerAdded }) {
	const [token] = useState(() => localStorage.getItem("authToken"));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!token) {
			setError("You must be logged in to add a volunteer.");
			return;
		}

		const formData = new FormData(event.currentTarget);
		const volunteer = {
			name: formData.get("name").trim(),
			email: formData.get("email").trim(),
			phone: formData.get("phone").trim(),
			address: formData.get("address").trim(),
			role: "General Support",
			isAway: formData.get("availability") === "away",
		};

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/volunteers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(volunteer),
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || `Unable to add volunteer (${response.status}).`,
				);
			}

			onVolunteerAdded({
				...result,
				status: result.isAway ? "away" : "available",
			});
			onClose();
		} catch (submitError) {
			setError(submitError.message || "Unable to add volunteer.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="add_volunteer_popup_overlay" onClick={onClose}>
			<div
				className="add_volunteer_schedule_popup"
				role="dialog"
				aria-modal="true"
				aria-labelledby="add_person_popup_title"
				onClick={(event) => event.stopPropagation()}>
				<div className="add_volunteer_title_bar">
					<div className="add_volunteer_title_left">
						<h3 className="add_volunteer_title" id="add_person_popup_title">
							Add Contact
						</h3>
						<p>Add a new volunteer contact</p>
					</div>
					<button
						type="button"
						className="close_popup_btn"
						id="close_popup_button"
						aria-label="Close add contact popup"
						onClick={onClose}>
						<X />
					</button>
				</div>

				<form
					className="add_volunteer_information_form"
					id="add_person_form"
					onSubmit={handleSubmit}>
					<div className="add_person_form_input">
						<h3>Add Volunteer's Name</h3>
						<input
							className="volunteer_name"
							type="text"
							name="name"
							placeholder="Enter Name"
							autoComplete="name"
							required
						/>
					</div>
					<div className="add_person_form_input">
						<h3>Add Volunteer's Email</h3>
						<input
							className="volunteer_email"
							type="email"
							name="email"
							placeholder="Enter Email"
							autoComplete="email"
						/>
					</div>
					<div className="add_person_form_input">
						<h3>Add Volunteer's Contact Number</h3>
						<input
							className="volunteer_contact_number"
							type="tel"
							name="phone"
							placeholder="+27"
							autoComplete="tel"
						/>
					</div>

					<div className="add_person_form_input">
						<h3>Add Volunteer's Address</h3>
						<input
							className="volunteer_address"
							type="text"
							name="address"
							placeholder="City, Street, House Number"
							autoComplete="street-address"
						/>
					</div>

					<div className="add_person_select_availability">
						<h3>Set Volunteer's Availability</h3>
						<select
							className="volunteer_availability_selector"
							name="availability"
							defaultValue="available">
							<option value="available">Available</option>
							<option value="away">Away</option>
						</select>
					</div>
				</form>

				{error && <p role="alert">{error}</p>}
				<div className="add_volunteer_actions">
					<button
						className="add_volunteer"
						id="add_volunteer"
						type="submit"
						form="add_person_form"
						disabled={isSubmitting}>
						<p>{isSubmitting ? "Adding..." : "+ Add Volunteer"}</p>
					</button>
				</div>
			</div>
		</div>
	);
}

export default AddPersonPopupComponent;
