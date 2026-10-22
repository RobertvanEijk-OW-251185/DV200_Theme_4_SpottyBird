// CSS Import
import "../componentStyling/casesFilterComponent.css";
import { Search } from "lucide-react";

function CasesSearchComponent({
	placeholder = "Search...",
	name,
	type = "text",
	value = "",
	onChange,
}) {
	return (
		<div className="cases_search_wrapper">
			<Search className="cases_search_icon" color="#6969697a" />
			<input
				className="cases_search_input"
				name={name}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}

export default CasesSearchComponent;
