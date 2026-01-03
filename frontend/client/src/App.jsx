import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddCar from "./pages/AddCar";
import MyCars from "./pages/MyCars";
import CarDetails from "./pages/CarDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/add-car" 
            element={<ProtectedRoute><AddCar /></ProtectedRoute>} 
          />

          <Route 
            path="/my-cars" 
            element={<ProtectedRoute><MyCars /></ProtectedRoute>} 
          />

          <Route path="/car/:id" element={<CarDetails />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
