// CSS Import
import "../componentStyling/casesFilterComponent.css";

function CasesFilterComponent({
	placeholder = "Select an option...",
	options = [],
	name,
	value,
	onChange,
}) {
	return (
		<select
			className="cases_filter"
			name={name}
			value={value}
			onChange={onChange}>
			<option value="">All {placeholder}</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

export default CasesFilterComponent;
