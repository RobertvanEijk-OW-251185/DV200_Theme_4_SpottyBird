// CSS Import
import "../componentStyling/mdOverviewCards.css";

function OverviewCardComponent({
	className = "",
	iconClassName = "",
	title,
	numb,
	extraInfo,
	icon: Icon = null,
	iconColor = "#12b507",
	iconBackgroundColor = "#eff8f1",
}) {
	return (
		<div className={`overview_card ${className}`}>
			{Icon && (
				<div
					className={`overview_card_icon ${iconClassName}`}
					style={{
						backgroundColor: iconBackgroundColor,
						color: iconColor,
					}}>
					<Icon className="module_icon" aria-hidden="true" />
				</div>
			)}
			<div className="overview_module_text">
				<h3>{title}</h3>
				<h1 className="numb">{numb}</h1>
				<p className="extraInfo_overviewCards">{extraInfo}</p>
			</div>
		</div>
	);
}

export default OverviewCardComponent;
