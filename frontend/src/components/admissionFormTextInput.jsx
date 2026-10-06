import "../componentStyling/admissionFormInputs.css";

function AdmissionFormTextInputComponent({
	title = "Title",
	placeholder = "",
}) {
	return (
		<div className="ad_form_input">
			<div>
				<p className="ad_form_input_title">{title}</p>
			</div>
			<input
				className="ad_form_input_self"
				type="text"
				placeholder={placeholder}
			/>
		</div>
	);
}

export default AdmissionFormTextInputComponent;
