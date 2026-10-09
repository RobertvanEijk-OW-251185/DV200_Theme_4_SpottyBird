// Import css file
import "../componentStyling/mdBarChartCard.css";

// Import React Stuffies
import { useEffect, useRef } from "react";

// Import chartjs thingss
import {
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	LinearScale,
	Tooltip,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const DEFAULT_LABELS = [
	"New Reports",
	"Assessment",
	"In Care",
	"Release Ready",
	"Closed",
];
const DEFAULT_VALUES = [17, 10, 31, 8, 44];

function BarChartCardModuleComponent({
	className = "",
	title = "",
	subtitle = "",
	labels = DEFAULT_LABELS,
	values = DEFAULT_VALUES,
}) {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const chart = new Chart(canvasRef.current, {
			type: "bar",
			data: {
				labels,
				datasets: [
					{
						label: title,
						data: values,
						backgroundColor: "#80a74b",
						borderRadius: 4,
						maxBarThickness: 80,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: { precision: 0 },
					},
				},
			},
		});

		return () => chart.destroy();
	}, [labels, title, values]);

	return (
		<div className={`overview_card bar_chart_card ${className}`}>
			<div className="chart_titles">
				<h3 className="bar_chart_title">{title}</h3>
				<p className="bar_chart_subtitle">{subtitle}</p>
			</div>
			<div className="bar_chart_canvas">
				<canvas ref={canvasRef} role="img" aria-label={`${title} bar chart`} />
			</div>
		</div>
	);
}

export default BarChartCardModuleComponent;
