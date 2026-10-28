// CSS Import
import "../componentStyling/shiftCalendar.css";

function ShiftScheduleBtnComponent({ onClick }) {
	return (
		<button
			className="assign_shift_btn"
			id="assign_shift_btn"
			type="button"
			onClick={onClick}>
			<div className="assign_btn_inner_container">
				<p className="open_shift">Open Shift</p>
				<p className="add_assign_label">+ Assign</p>
			</div>
		</button>
	);
}

export default ShiftScheduleBtnComponent;
