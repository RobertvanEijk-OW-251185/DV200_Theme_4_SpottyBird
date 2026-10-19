// CSS Import
import "../componentStyling/textFieldInput.css";

// Other Imports

function EmailInput({ value, onChange }) {
	return (
		<div className="textFieldInputComponent">
			<h3 className="textInputFormTitle">Enter Email</h3>
			<div className="TextInputFormSelf">
				<input
					className="textInputFormText"
					type="email"
					name="email"
					autoComplete="username"
					required
					placeholder="Enter your email..."
					value={value}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}

export default EmailInput;
