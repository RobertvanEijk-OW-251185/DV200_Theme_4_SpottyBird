// CSS Import
import "../componentStyling/textFieldInput.css";

// Other Imports

function PasswordInput({ value, onChange }) {
	return (
		<div className="textFieldInputComponent">
			<h3 className="textInputFormTitle">Enter Password</h3>
			<div className="TextInputFormSelf">
				<input
					className="textInputFormText"
					type="password"
					name="password"
					autoComplete="current-password"
					required
					placeholder="Enter your password..."
					value={value}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}

export default PasswordInput;
