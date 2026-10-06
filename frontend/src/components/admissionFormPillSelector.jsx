import "../componentStyling/admissionFormInputs.css";

function AdmissionFormPillSelectComponent({ title = "Title" }) {
	return (
		<button className="ad_form_pill_select">
			<p className="ad_form_pill_select_title">{title}</p>
		</button>
	);
}

export default AdmissionFormPillSelectComponent;
