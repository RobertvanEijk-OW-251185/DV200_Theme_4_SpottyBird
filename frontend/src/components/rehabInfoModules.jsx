// css import
import "../componentStyling/rehabInfoModules.css";

function RehabInfoModules({ title, stat, info, icon: Icon, variant }) {
	return (
		<div className="rehab_info_module">
			<div className={`info_module_icon ${variant}`}>
				<Icon aria-hidden="true" />
			</div>
			<div className="rehab_info_module_text">
				<h3 className="rim_title">{title}</h3>
				<p className="rim_stat">{stat}</p>
				<p className="rim_info">{info}</p>
			</div>
		</div>
	);
}

export default RehabInfoModules;
