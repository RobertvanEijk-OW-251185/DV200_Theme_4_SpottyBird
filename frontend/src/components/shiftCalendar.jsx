// CSS Import
import "../componentStyling/shiftCalendar.css";

// rect imports
import { useEffect, useState } from "react";

// component imports
import ShiftScheduledComponent from "./shiftScheduledComponent";
import ShiftScheduleBtnComponent from "./shiftScheduleBtnComponent";

//
// Calendar Compoonent

// I have built this thing 5 different times now... Please... I beg just work

function ShiftCalendar({ onAssignShift }) {
	return (
		<div className="shift_cal_grid">
			{/* Top Row --> Shows Days */}
			<div className="open_cell shift_cell_border"></div>
			<div className="date_cell shift_cell_border d1">
				<p>Mon _</p>
			</div>
			<div className="date_cell shift_cell_border d2">
				<p>Tue _</p>
			</div>
			<div className="date_cell shift_cell_border d3">
				<p>Wed _</p>
			</div>
			<div className="date_cell shift_cell_border d4">
				<p>Thur _</p>
			</div>
			<div className="date_cell shift_cell_border d5">
				<p>Fri _</p>
			</div>
			<div className="date_cell shift_cell_border d6">
				<p>Sat _</p>
			</div>
			<div className="date_cell shift_cell_border d7">
				<p>Sun _</p>
			</div>
			{/* Second Row --> Shows Morning Shifts x Day */}
			<div className="morning_shift shift_cell">
				<p className="shift_heading">Morning Shift</p>
				<p>08:00 - 12:00</p>
			</div>
			<div className="md1 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md2 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md3 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md4 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md5 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md6 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="md7 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			{/* Third Row --> Shows Afternoon Shifts x Day */}
			<div className="afternoon_shift shift_cell">
				<p className="shift_heading">Afternoon Shift</p>
				<p>12:00 - 16:00</p>
			</div>
			<div className="ed1 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed2 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed3 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed4 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed5 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed6 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ed7 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			{/* fourth Row --> Shows Evening Shifts x Day */}
			<div className="evening_shift shift_cell">
				<p className="shift_heading">Evening Shift</p>
				<p>16:00 - 22:00</p>
			</div>
			<div className="ad1 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad2 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad3 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad4 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad5 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad6 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
			<div className="ad7 shift_cells_to_assign">
				<ShiftScheduleBtnComponent onClick={onAssignShift} />
			</div>
		</div>
	);
}

export default ShiftCalendar;
