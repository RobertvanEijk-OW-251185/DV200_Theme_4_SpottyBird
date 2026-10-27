// CSS Import
import "../componentStyling/shiftCalendar.css";

import { X } from "lucide-react";

function ShiftSchedulePopUpComponent({ onClose }) {
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
			</div>
		</div>
	);
}

export default ShiftSchedulePopUpComponent;
