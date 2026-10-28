// CSS Import
import "../componentStyling/shiftCalendar.css";

function ShiftScheduledComponent({ shift }) {
	return (
		<div className="scheduled_shift">
			{shift.assignees.map((assignee) => (
				<p className="assignee_name" key={assignee._id}>
					{assignee.name}
				</p>
			))}
			{shift.enclosure && (
				<p className="assigned_enclosure">{shift.enclosure}</p>
			)}
			<p className="assigned_shift_time">
				{shift.startTime} - {shift.endTime}
			</p>
		</div>
	);
}

export default ShiftScheduledComponent;
