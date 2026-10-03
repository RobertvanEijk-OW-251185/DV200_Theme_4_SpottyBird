// Import CSS
import "./App.css";

// Import Components
import Navbar from "./components/navbar";

// Import Pages
import LogInPage from "./pages/login";

// Import Browser Router stuff...
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<>
			<BrowserRouter>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<LogInPage />} />
					{/* <Route path="/browse" element={<ProductsPage />} />
					<Route path="/sell" element={<SubmitProduct />} />
					<Route path="/sell/:id" element={<EditProduct />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/edit/:id" element={<EditProduct />} /> */}
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
