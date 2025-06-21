import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookingPage from "./components/BookingPage";
import "./App.css";
import ConfirmTicket from "./components/ConfirmTicket";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page - Doctor List */}
        <Route path="/" element={<Home />} />

        {/* Booking Page - Displays Booking Form for a Specific Doctor */}
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/ticket" element={<ConfirmTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
