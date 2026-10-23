// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Main.css";

import { useEffect, useRef, useState } from "react";
import {
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	DoughnutController,
	Legend,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import OverviewCardComponent from "../components/mdOverviewCards";
import BarChartCardModuleComponent from "../components/mdBarChartCard";

// Import Font Awesome icons
import {
	faCircleInfo,
	faFileCirclePlus,
	faSuitcaseMedical,
	faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import {
	FilePlusCorner,
	ShieldAlert,
	CircleQuestionMark,
	ShieldPlus,
} from "lucide-react";

Chart.register(
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	DoughnutController,
	Legend,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
);

const ANIMAL_TYPE_COLORS = ["#1D5120", "#316534", "#638447", "#A8B98D"];
const ADMISSIONS_COLOR = "#1D5120";
const RELEASES_COLOR = "#78945B";
const SPECIES_COLORS = ["#1D5120", "#316534", "#638447", "#A8B98D"];
const WORKFLOW_STAGE_COLORS = [
	"#1D5120",
	"#316534",
	"#4E7746",
	"#78945B",
	"#A8B98D",
];

function MainDash() {
	const doughnutCanvasRef = useRef(null);
	const lineCanvasRef = useRef(null);
	const speciesCanvasRef = useRef(null);
	const [workflowData, setWorkflowData] = useState({
		labels: [],
		values: [],
	});
	const [isWorkflowLoading, setIsWorkflowLoading] = useState(true);
	const [workflowError, setWorkflowError] = useState("");
	const [animalTypeData, setAnimalTypeData] = useState({
		labels: [],
		values: [],
	});
	const [isAnimalTypesLoading, setIsAnimalTypesLoading] = useState(true);
	const [animalTypesError, setAnimalTypesError] = useState("");
	const [speciesData, setSpeciesData] = useState({
		labels: [],
		values: [],
		total: 0,
	});
	const [isSpeciesLoading, setIsSpeciesLoading] = useState(true);
	const [speciesError, setSpeciesError] = useState("");
	const [admissionsReleasesData, setAdmissionsReleasesData] = useState({
		labels: [],
		admissions: [],
		releases: [],
	});
	const [isAdmissionsReleasesLoading, setIsAdmissionsReleasesLoading] =
		useState(true);
	const [admissionsReleasesError, setAdmissionsReleasesError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		const loadWorkflowData = async () => {
			try {
				const response = await fetch("/api/cases/workflow-stages", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}

				const isValidResult =
					result &&
					Array.isArray(result.labels) &&
					result.labels.length > 0 &&
					result.labels.every((label) => typeof label === "string") &&
					Array.isArray(result.values) &&
					result.values.length === result.labels.length &&
					result.values.every((value) => Number.isInteger(value) && value >= 0);

				if (!isValidResult) {
					throw new Error(
						"The server returned invalid workflow-stage chart data.",
					);
				}

				setWorkflowData({
					labels: result.labels,
					values: result.values,
				});
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setWorkflowError(
						fetchError.message || "Unable to load workflow-stage data.",
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsWorkflowLoading(false);
				}
			}
		};

		loadWorkflowData();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		const loadAnimalTypeData = async () => {
			try {
				const response = await fetch("/api/cases/animal-types", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}

				const isValidResult =
					result &&
					Array.isArray(result.labels) &&
					result.labels.length > 0 &&
					result.labels.every((label) => typeof label === "string") &&
					Array.isArray(result.values) &&
					result.values.length === result.labels.length &&
					result.values.every((value) => Number.isInteger(value) && value >= 0);

				if (!isValidResult) {
					throw new Error(
						"The server returned invalid animal-type chart data.",
					);
				}

				setAnimalTypeData({
					labels: result.labels,
					values: result.values,
				});
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setAnimalTypesError(
						fetchError.message || "Unable to load animal-type data.",
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsAnimalTypesLoading(false);
				}
			}
		};

		loadAnimalTypeData();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		const loadSpeciesData = async () => {
			try {
				const response = await fetch("/api/cases/species-breakdown", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}

				const isValidResult =
					result &&
					Array.isArray(result.labels) &&
					result.labels.length > 0 &&
					result.labels.every((label) => typeof label === "string") &&
					Array.isArray(result.values) &&
					result.values.length === result.labels.length &&
					result.values.every(
						(value) => Number.isInteger(value) && value >= 0,
					) &&
					Number.isInteger(result.total) &&
					result.total >= 0 &&
					result.total === result.values.reduce((sum, value) => sum + value, 0);

				if (!isValidResult) {
					throw new Error(
						"The server returned invalid species breakdown data.",
					);
				}

				setSpeciesData({
					labels: result.labels,
					values: result.values,
					total: result.total,
				});
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setSpeciesError(
						fetchError.message || "Unable to load species breakdown data.",
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsSpeciesLoading(false);
				}
			}
		};

		loadSpeciesData();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		const loadAdmissionsReleasesData = async () => {
			try {
				const response = await fetch("/api/cases/admissions-releases", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}

				const isValidResult =
					result &&
					Array.isArray(result.labels) &&
					result.labels.length > 0 &&
					result.labels.every((label) => typeof label === "string") &&
					Array.isArray(result.admissions) &&
					result.admissions.length === result.labels.length &&
					result.admissions.every(
						(value) => Number.isInteger(value) && value >= 0,
					) &&
					Array.isArray(result.releases) &&
					result.releases.length === result.labels.length &&
					result.releases.every(
						(value) => Number.isInteger(value) && value >= 0,
					);

				if (!isValidResult) {
					throw new Error(
						"The server returned invalid admissions and releases data.",
					);
				}

				setAdmissionsReleasesData({
					labels: result.labels,
					admissions: result.admissions,
					releases: result.releases,
				});
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setAdmissionsReleasesError(
						fetchError.message || "Unable to load admissions and releases.",
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsAdmissionsReleasesLoading(false);
				}
			}
		};

		loadAdmissionsReleasesData();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (
			isAnimalTypesLoading ||
			animalTypesError ||
			!doughnutCanvasRef.current
		) {
			return;
		}

		const chart = new Chart(doughnutCanvasRef.current, {
			type: "doughnut",
			data: {
				labels: animalTypeData.labels,
				datasets: [
					{
						data: animalTypeData.values,
						backgroundColor: ANIMAL_TYPE_COLORS,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: "65%",
				plugins: {
					legend: {
						position: "right",
						align: "center",
						labels: {
							boxWidth: 10,
							padding: 12,
							usePointStyle: true,
							pointStyle: "circle",
						},
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const total = context.dataset.data.reduce(
									(sum, value) => sum + value,
									0,
								);
								const percentage = total
									? ((context.raw / total) * 100).toFixed(1)
									: "0.0";

								return `${context.label}: ${context.raw} cases (${percentage}%)`;
							},
						},
					},
				},
			},
		});

		return () => chart.destroy();
	}, [
		animalTypeData.labels,
		animalTypeData.values,
		animalTypesError,
		isAnimalTypesLoading,
	]);

	useEffect(() => {
		if (
			isAdmissionsReleasesLoading ||
			admissionsReleasesError ||
			!lineCanvasRef.current
		) {
			return;
		}

		const chart = new Chart(lineCanvasRef.current, {
			type: "line",
			data: {
				labels: admissionsReleasesData.labels,
				datasets: [
					{
						label: "Admissions",
						data: admissionsReleasesData.admissions,
						borderColor: ADMISSIONS_COLOR,
						backgroundColor: ADMISSIONS_COLOR,
						tension: 0.35,
						pointRadius: 3,
						pointHoverRadius: 5,
					},
					{
						label: "Releases",
						data: admissionsReleasesData.releases,
						borderColor: RELEASES_COLOR,
						backgroundColor: RELEASES_COLOR,
						tension: 0.35,
						pointRadius: 3,
						pointHoverRadius: 5,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					intersect: false,
					mode: "index",
				},
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
	}, [
		admissionsReleasesData.admissions,
		admissionsReleasesData.labels,
		admissionsReleasesData.releases,
		admissionsReleasesError,
		isAdmissionsReleasesLoading,
	]);

	useEffect(() => {
		if (isSpeciesLoading || speciesError || !speciesCanvasRef.current) return;

		const chart = new Chart(speciesCanvasRef.current, {
			type: "bar",
			data: {
				labels: speciesData.labels,
				datasets: [
					{
						label: "Active Cases",
						data: speciesData.values,
						backgroundColor: SPECIES_COLORS,
						borderRadius: 4,
						maxBarThickness: 24,
					},
				],
			},
			options: {
				indexAxis: "y",
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
				},
				scales: {
					x: {
						beginAtZero: true,
						ticks: { precision: 0 },
						grid: { display: false },
						display: false,
					},
					y: {
						grid: { display: false },
						// display: false,
					},
				},
			},
		});

		return () => chart.destroy();
	}, [isSpeciesLoading, speciesData.labels, speciesData.values, speciesError]);

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Admissions & Insights"
				description="Admissions, rehabilitation performance and case outcomes at a glance."
				prevPage=""
			/>
			<div className="main_dash_filters">
				<div className="md_filters_self"></div>
			</div>
			<div className="main_dash_module_grid">
				<OverviewCardComponent
					className="grid_module_test"
					title="New Reports"
					numb="18"
					extraInfo="new Reports"
					icon={FilePlusCorner}
					iconColor="#2db418"
					iconBackgroundColor="#eafded"
				/>
				<OverviewCardComponent
					className="grid_module_test2"
					title="Urgent"
					numb="4"
					extraInfo="Requires Attention"
					icon={ShieldAlert}
					iconColor="#b42318"
					iconBackgroundColor="#fdecea"
				/>
				<OverviewCardComponent
					className="grid_module_test3"
					title="Info Pending"
					numb="6"
					extraInfo="+6 Needs Response"
					icon={CircleQuestionMark}
					iconColor="#175cd3"
					iconBackgroundColor="#eff8ff"
				/>
				<OverviewCardComponent
					className="grid_module_test4"
					title="In Rehab"
					numb="18"
					extraInfo="+5 This Week"
					icon={ShieldPlus}
					iconColor="#6941c6"
					iconBackgroundColor="#f4f3ff"
				/>
				<BarChartCardModuleComponent
					className="grid_module_test5"
					title="Cases by workflow stage"
					subtitle="Current distribution across the case lifecycle"
					labels={workflowData.labels}
					values={workflowData.values}
					colors={WORKFLOW_STAGE_COLORS}
					isLoading={isWorkflowLoading}
					error={workflowError}
				/>
				<div className="grid_module_test6 animal_types">
					<div className="at_titles">
						<h3>Animal Types</h3>
						<p>Completed Cases by Animal Group</p>
					</div>
					<div className="at_doughnut_chart">
						{isAnimalTypesLoading ? (
							<p>Loading animal types...</p>
						) : animalTypesError ? (
							<p role="alert">{animalTypesError}</p>
						) : (
							<canvas
								ref={doughnutCanvasRef}
								role="img"
								aria-label="Doughnut chart showing completed cases by animal group"
							/>
						)}
					</div>
				</div>
				<div className="grid_module_test7 admissions_v_releases">
					<div className="av_module_title_content">
						<div className="avr_titles">
							<h3>Admissions vs Releases:</h3>
							<p>Monthly totals for the last six months</p>
						</div>
						<div className="avr_tags">
							<div className="admissions_tag">
								<p>Admissions</p>
							</div>
							<div className="releases_tag">
								<p>Releases</p>
							</div>
						</div>
					</div>
					<div className="avr_line_graph">
						{isAdmissionsReleasesLoading ? (
							<p>Loading admissions and releases...</p>
						) : admissionsReleasesError ? (
							<p role="alert">{admissionsReleasesError}</p>
						) : (
							<canvas
								ref={lineCanvasRef}
								role="img"
								aria-label="Line graph comparing monthly admissions and releases over the last six months"
							/>
						)}
					</div>
				</div>
				<div className="grid_module_test8 species_breakdown">
					<div className="sb_titles">
						<h3>Species Breakdown:</h3>
						<p>Active Cases By Animal Group</p>
					</div>
					<div className="sb_horizontal_bar_chart">
						{isSpeciesLoading ? (
							<p>Loading species breakdown...</p>
						) : speciesError ? (
							<p role="alert">{speciesError}</p>
						) : (
							<canvas
								ref={speciesCanvasRef}
								role="img"
								aria-label={`Horizontal bar chart of ${speciesData.total} active cases by animal group`}
							/>
						)}
					</div>
					<p>{speciesData.total} Active Cases</p>
				</div>
			</div>
		</div>
	);
}

export default MainDash;
