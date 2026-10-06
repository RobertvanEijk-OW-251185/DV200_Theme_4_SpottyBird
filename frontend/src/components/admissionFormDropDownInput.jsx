import "../componentStyling/admissionFormInputs.css";

function AdmissionFormDropDownInputComponent({
	title = "Title",
	placeholder = "Select an option...",
	options = [],
}) {
	return (
		<div className="ad_form_input">
			<div>
				<p className="ad_form_input_title">{title}</p>
			</div>
			<select className="ad_form_input_self ad_form_select" defaultValue="">
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

export default AdmissionFormDropDownInputComponent;
