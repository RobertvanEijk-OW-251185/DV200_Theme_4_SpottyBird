import "../componentStyling/admissionFormInputs.css";

function AdmissionFormTextNotesInputComponent({
	title = "Title",
	placeholder = "",
	name,
	required = false,
}) {
	return (
		<div className="ad_form_input">
			<div>
				<p className="ad_form_input_title">{title}</p>
			</div>
			<textarea
				className="ad_form_notes_input_self"
				name={name}
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
}

export default AdmissionFormTextNotesInputComponent;
