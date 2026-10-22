// CSS Import
import "../pagesStyling/MainContent.css";

// React Imports
import { useEffect, useState } from "react";
import { Bird, FilePlus, HeartPulse, Truck } from "lucide-react";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import RehabilitationComponent from "../components/rehabList";
import RehabInfoModules from "../components/rehabInfoModules";

const infoModules = [
	{
		key: "inCare",
		title: "Animals in care",
		info: "Currently receiving care",
		icon: Bird,
		variant: "in_care",
	},
	{
		key: "critical",
		title: "Critical condition",
		info: "Marked as urgent",
		icon: HeartPulse,
		variant: "in_critical",
	},
	{
		key: "releaseReady",
		title: "Ready for release",
		info: "Ready to return to the wild",
		icon: Truck,
		variant: "release_ready",
	},
	{
		key: "needsUpdating",
		title: "Needs updating",
		info: "Missing details or needs updating",
		icon: FilePlus,
		variant: "pending_info",
	},
];

function Rehabilitation() {
	const [summary, setSummary] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		const loadSummary = async () => {
			try {
				const response = await fetch("/api/cases/summary", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}
				if (
					!result ||
					!infoModules.every(
						({ key }) => Number.isInteger(result[key]) && result[key] >= 0,
					)
				) {
					throw new Error("The server returned an invalid case summary.");
				}

				setSummary(result);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(fetchError.message || "Unable to load case summary.");
				}
			}
		};

		loadSummary();
		return () => controller.abort();
	}, []);

	const [rehabCases, setRehabCases] = useState([]);
	const [casesLoading, setCasesLoading] = useState(true);
	const [casesError, setCasesError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		const loadRehabCases = async () => {
			try {
				const response = await fetch("/api/cases/rehabilitation", {
					signal: controller.signal,
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}

				if (!Array.isArray(result)) {
					throw new Error(
						"The server returned an invalid rehabilitation response.",
					);
				}

				setRehabCases(result);
			} catch (rehabFetchErr) {
				if (rehabFetchErr.name !== "AbortError") {
					setCasesError(
						rehabFetchErr.message || "Unable to load rehabilitation cases",
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setCasesLoading(false);
				}
			}
		};

		loadRehabCases();
		return () => controller.abort();
	}, []);

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Rehabilitation"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
			<div className="rehab_info_modules">
				{infoModules.map(({ key, ...module }) => (
					<RehabInfoModules
						key={key}
						{...module}
						stat={summary ? summary[key] : "—"}
					/>
				))}
			</div>
			{error && (
				<p className="rehab_summary_error" role="alert">
					{error}
				</p>
			)}
			<RehabilitationComponent
				cases={rehabCases}
				isLoading={casesLoading}
				error={casesError}
			/>
		</div>
	);
}

export default Rehabilitation;
