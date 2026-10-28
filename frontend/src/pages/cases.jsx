// CSS Import
import "../pagesStyling/MainContent.css";
import "../pagesStyling/Cases.css";

// React Imports
import { useEffect, useState } from "react";

// Component Import
import PageHeaderComponent from "../components/pagesHeader";
import CasesFilterComponent from "../components/casesFilterComponent";
import CasesSearchComponent from "../components/casesSearchComponent";
import CasesListComponent from "../components/casesList";

const toOptions = (values) =>
	[...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

function Cases() {
	const [cases, setCases] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [filters, setFilters] = useState({
		animalType: "",
		location: "",
		priority: "",
		status: "",
		assignee: "",
		search: "",
	});

	useEffect(() => {
		const controller = new AbortController();

		const loadCases = async () => {
			try {
				const response = await fetch("/api/cases", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}
				if (!Array.isArray(result)) {
					throw new Error("The server returned an invalid cases response.");
				}

				setCases(result);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(fetchError.message || "Unable to load cases.");
				}
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		};

		loadCases();
		return () => controller.abort();
	}, []);

	const handleFilterChange = (event) => {
		const { name, value } = event.target;
		setFilters((current) => ({ ...current, [name]: value }));
	};

	const normalizedSearch = filters.search.trim().toLowerCase();

	const filteredCases = cases.filter((caseRecord) => {
		const location =
			caseRecord.incident?.locationName || caseRecord.incident?.address || "";

		const matchesAnimal =
			!filters.animalType || caseRecord.animal?.type === filters.animalType;

		const matchesLocation =
			!filters.location ||
			location.toLocaleLowerCase() === filters.location.toLocaleLowerCase();

		const matchesPriority =
			!filters.priority || caseRecord.priority === filters.priority;

		const matchesStatus =
			!filters.status || caseRecord.status === filters.status;

		const assignedTo =
			caseRecord.assignment?.assignedVolunteer ||
			caseRecord.assignment?.assignedTo;
		const assigneeId =
			typeof assignedTo === "object" ? assignedTo?._id : assignedTo;
		const matchesAssignee =
			!filters.assignee ||
			(filters.assignee === "unassigned" && !assignedTo) ||
			assigneeId === filters.assignee;

		const searchableText = [
			caseRecord.caseNumber,
			caseRecord.animal?.species,
			caseRecord.animal?.type,
			location,
			caseRecord.status,
			caseRecord.priority,
			caseRecord.incident?.description,
		]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		const matchesSearch =
			!normalizedSearch || searchableText.includes(normalizedSearch);

		return (
			matchesAnimal &&
			matchesLocation &&
			matchesPriority &&
			matchesStatus &&
			matchesAssignee &&
			matchesSearch
		);
	});

	const locations = toOptions(
		cases.map(
			(caseRecord) =>
				caseRecord.incident?.locationName || caseRecord.incident?.address,
		),
	);
	const assignees = [
		...new Map(
			cases
				.map((caseRecord) => {
					const assignedTo =
						caseRecord.assignment?.assignedVolunteer ||
						caseRecord.assignment?.assignedTo;
					if (!assignedTo) return null;
					const value =
						typeof assignedTo === "object" ? assignedTo._id : assignedTo;
					const label =
						typeof assignedTo === "object"
							? assignedTo.name ||
								assignedTo.username ||
								assignedTo.email ||
								value
							: assignedTo;
					return value ? [value, label] : null;
				})
				.filter(Boolean),
		),
	].map(([value, label]) => ({ value, label }));

	return (
		<div className="main_content">
			<PageHeaderComponent
				title="Cases List"
				description="Case identification numbers , locations status and priorities all in one place"
				prevPage=""
			/>
			<div className="cases_container">
				{/* Filter Row + Search */}
				<div className="filter_container">
					<CasesFilterComponent
						placeholder="Animal Type"
						name="animalType"
						value={filters.animalType}
						onChange={handleFilterChange}
						options={[
							{ label: "Mammal", value: "mammal" },
							{ label: "Reptile", value: "reptile" },
							{ label: "Bird", value: "bird" },
							{ label: "Other", value: "other" },
						]}
					/>
					<CasesFilterComponent
						placeholder="Location"
						name="location"
						value={filters.location}
						onChange={handleFilterChange}
						options={locations.map((location) => ({
							label: location,
							value: location,
						}))}
					/>
					<CasesFilterComponent
						placeholder="Urgency"
						name="priority"
						value={filters.priority}
						onChange={handleFilterChange}
						options={[
							{ label: "Urgent", value: "urgent" },
							{ label: "High", value: "high" },
							{ label: "Medium", value: "medium" },
							{ label: "Low", value: "low" },
						]}
					/>
					<CasesFilterComponent
						placeholder="Status"
						name="status"
						value={filters.status}
						onChange={handleFilterChange}
						options={[
							{ label: "New report", value: "new_report" },
							{ label: "Assessment", value: "assessment" },
							{ label: "In care", value: "in_care" },
							{ label: "Release ready", value: "release_ready" },
							{ label: "Closed", value: "closed" },
						]}
					/>
					<CasesFilterComponent
						placeholder="Assignee"
						name="assignee"
						value={filters.assignee}
						onChange={handleFilterChange}
						options={[
							{ label: "Unassigned", value: "unassigned" },
							...assignees,
						]}
					/>
					{/* Might add searhc later... not quite sure as of currently */}
					{/* <CasesSearchComponent
						name="search"
						value={filters.search}
						onChange={handleFilterChange}
					/> */}
				</div>
				{/* Title */}
				<div className="cases_list_title">
					<h3 className="cases_list_h3">Cases</h3>
					<p>Recent reports and cases needing attention</p>
				</div>
				{/* The Cases List */}
				<CasesListComponent
					cases={filteredCases}
					isLoading={isLoading}
					error={error}
				/>
			</div>
		</div>
	);
}

export default Cases;
