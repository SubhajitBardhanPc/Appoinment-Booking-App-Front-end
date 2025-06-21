import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";

function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(location.state?.bookingData || null);
  const [loading, setLoading] = useState(!bookingData);

  const [patient, setPatient] = useState({ name: "", phone: "", otp: "", inputOtp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      axios
        .get(`http://localhost:8080/api/doctors/${id}`)
        .then((res) => {
          setBookingData({
            id: res.data.id,
            name: res.data.doctorName,
            contact: res.data.contact,
            address: res.data.address,
            timing: res.data.timing,
            availableDays: res.data.availableDays,
            image: "/images/default-doctor.jpg",
          });
          setLoading(false);
        })
        .catch(() => {
          alert("⚠️ Please book via homepage!");
          navigate("/", { replace: true });
        });
    }
  }, [bookingData, id, navigate]);

  const handleGenerateOTP = () => {
    if (!patient.name.trim() || !patient.phone.trim()) {
      alert("🚨 Please enter Patient Name and Phone Number!");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`🔐 OTP Sent: ${otp}`);
    setPatient((prev) => ({ ...prev, otp }));
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {
    if (patient.otp === patient.inputOtp) {
      alert("✅ OTP Verified!");
      setVerified(true);
    } else {
      alert("❌ Invalid OTP! Try again.");
      setVerified(false);
    }
  };

  const handleBooking = () => {
    if (!verified) {
      alert("⚠️ Please verify OTP before booking.");
      return;
    }

    // Redirect to /ticket with booking & patient info
    navigate("/ticket", {
      state: {
        doctor: bookingData,
        patient: { name: patient.name, phone: patient.phone },
        bookingTime: new Date().toISOString(),
      },
    });
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading booking details...</p>;
  if (!bookingData) return null;

  return (
    <div className="booking-container">
      <h2 className="booking-heading">
        📝 Booking Appointment for <span>{bookingData.name}</span>
      </h2>

      <div className="doctor-info-card">
        <img src={bookingData.image} alt={bookingData.name} className="doctor-image" />
        <div className="doctor-details">
          <p><strong>📞 Contact:</strong> {bookingData.contact}</p>
          <p><strong>📅 Available Days:</strong> {bookingData.availableDays}</p>
          <p><strong>🕒 Timing:</strong> {bookingData.timing}</p>
          <p><strong>📍 Address:</strong> {bookingData.address}</p>
        </div>
      </div>

      <div className="booking-form">
        <input
          type="text"
          placeholder="Patient Name"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          className="booking-input"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={patient.phone}
          onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
          className="booking-input"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={patient.inputOtp}
          onChange={(e) => setPatient({ ...patient, inputOtp: e.target.value })}
          disabled={!otpSent}
          className={`booking-input ${otpSent ? "otp-enabled" : ""}`}
        />

        <div className="button-group">
          <button onClick={handleGenerateOTP} type="button" className="btn-generate">
            Generate OTP
          </button>

          <button onClick={handleVerifyOTP} type="button" disabled={!otpSent} className="btn-verify">
            Verify OTP
          </button>
        </div>

        <button onClick={handleBooking} disabled={!verified} type="button" className="btn-book">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
