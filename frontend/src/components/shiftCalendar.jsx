// CSS Import
import "../componentStyling/shiftCalendar.css";

import { addDays, format } from "date-fns";
import ShiftScheduledComponent from "./shiftScheduledComponent";
import ShiftScheduleBtnComponent from "./shiftScheduleBtnComponent";

const periods = [
	{
		key: "morning",
		label: "Morning Shift",
		startTime: "08:00",
		endTime: "12:00",
	},
	{
		key: "afternoon",
		label: "Afternoon Shift",
		startTime: "12:00",
		endTime: "16:00",
	},
	{
		key: "evening",
		label: "Evening Shift",
		startTime: "16:00",
		endTime: "20:00",
	},
];

function ShiftCalendarCell({ shift, onAssignShift }) {
	if (!shift) {
		return <p className="open_shift">No shift configured</p>;
	}

	const assignedVolunteers = shift.assignees || [];
	const hasSpace = assignedVolunteers.length < shift.capacity;

	return (
		<>
			{assignedVolunteers.length > 0 && (
				<ShiftScheduledComponent shift={shift} />
			)}
			{hasSpace && (
				<ShiftScheduleBtnComponent onClick={() => onAssignShift(shift)} />
			)}
		</>
	);
}

function ShiftCalendar({ weekStart, shifts, onAssignShift }) {
	const days = [];
	for (let index = 0; index < 7; index += 1) {
		const date = addDays(weekStart, index);
		days.push({
			date,
			key: format(date, "yyyy-MM-dd"),
		});
	}

	const periodRows = [];
	const shiftCells = [];

	for (let periodIndex = 0; periodIndex < periods.length; periodIndex += 1) {
		const period = periods[periodIndex];
		const row = periodIndex + 2;

		periodRows.push({ period, row });

		for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
			const date = days[dayIndex].key;
			const shift = shifts.find(
				(item) => item.date === date && item.period === period.key,
			);

			shiftCells.push({
				key: `${date}-${period.key}`,
				shift,
				row,
				column: dayIndex + 2,
			});
		}
	}

	return (
		<div className="shift_cal_grid">
			<div className="open_cell shift_cell_border"></div>
			{days.map((day, index) => (
				<div
					className="date_cell shift_cell_border"
					key={day.key}
					style={{ gridRow: 1, gridColumn: index + 2 }}>
					<p>{format(day.date, "EEE d")}</p>
				</div>
			))}
			{periodRows.map(({ period, row }) => (
				<div
					className="shift_cell"
					key={period.key}
					style={{ gridRow: row, gridColumn: 1 }}>
					<p className="shift_heading">{period.label}</p>
					<p>
						{period.startTime} - {period.endTime}
					</p>
				</div>
			))}
			{shiftCells.map((cell) => (
				<div
					className="shift_cells_to_assign"
					key={cell.key}
					style={{ gridRow: cell.row, gridColumn: cell.column }}>
					<ShiftCalendarCell shift={cell.shift} onAssignShift={onAssignShift} />
				</div>
			))}
		</div>
	);
}

export default ShiftCalendar;
