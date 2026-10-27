// CSS Import
import "../componentStyling/shiftCalendar.css";

function ShiftScheduledComponent() {
	return (
		<div className="scheduled_shift">
			<p className="assignee_name">K. Schmidt</p>
			<p className="assigned_enclosure">Rehab Enclosure</p>
			<p className="assigned_shift_time">08:00 - 12:00</p>
		</div>
	);
}

export default ShiftScheduledComponent;
