import "../componentStyling/admissionFormInputs.css";

function AdmissionFormTextInputComponent({
	title = "Title",
	placeholder = "",
	name,
	type = "text",
	required = false,
}) {
	return (
		<div className="ad_form_input">
			<div>
				<p className="ad_form_input_title">{title}</p>
			</div>
			<input
				className="ad_form_input_self"
				name={name}
				type={type}
				placeholder={placeholder}
				required={required}
				step={type === "number" ? "any" : undefined}
			/>
		</div>
	);
}

export default AdmissionFormTextInputComponent;
