// CSS Import
import "../componentStyling/textFieldInput.css";

// Other Imports

function EmailInput() {
	return (
		<div className="textFieldInputComponent">
			<h3 className="textInputFormTitle">Enter Email</h3>
			<form className="TextInputFormSelf">
				<input
					className="textInputFormText"
					type="text"
					placeholder="Enter your email..."
				/>
			</form>
		</div>
	);
}

export default EmailInput;
