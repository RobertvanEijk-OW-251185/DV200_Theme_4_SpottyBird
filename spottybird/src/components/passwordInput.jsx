// CSS Import
import "../componentStyling/textFieldInput.css";

// Other Imports

function PasswordInput() {
	return (
		<div className="textFieldInputComponent">
			<h3 className="textInputFormTitle">Enter Password</h3>
			<form className="TextInputFormSelf">
				<input
					className="textInputFormText"
					type="text"
					placeholder="Enter your password..."
				/>
			</form>
		</div>
	);
}

export default PasswordInput;
