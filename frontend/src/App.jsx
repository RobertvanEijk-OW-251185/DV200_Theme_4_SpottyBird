// Import CSS
import "./App.css";

// Import Components
import Navbar from "./components/navbar";

// Import Pages
import LogInPage from "./pages/login";
import MainDash from "./pages/dashboardMain";
import Cases from "./pages/cases";
import Admissions from "./pages/admissions";
import Rehabilitation from "./pages/rehabilitation";
import Records from "./pages/records";
import Volunteers from "./pages/volunteers";

// Import Browser Router stuff...
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function AppRoutes() {
	const location = useLocation();

	return (
		<div className="app-layout">
			{location.pathname !== "/" && <Navbar />}
			<main className="app-page-content">
				<Routes>
					<Route path="/" element={<LogInPage />} />
					<Route path="/main" element={<MainDash />} />
					<Route path="/cases" element={<Cases />} />
					<Route path="/admissions" element={<Admissions />} />
					<Route path="/rehabilitation" element={<Rehabilitation />} />
					<Route path="/records" element={<Records />} />
					<Route path="/volunteers" element={<Volunteers />} />
				</Routes>
			</main>
		</div>
	);
}

function App() {
	return (
		<>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</>
	);
}

export default App;
