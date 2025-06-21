import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const doctorImages = ["/images/d1.jpg", "/images/d2.jpg", "/images/d3.jpg"];

  // Fetch doctors list on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // On Book Now, get detailed doctor data and navigate with state
  const handleBooking = async (id, image) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/doctors/${id}`);
      const doctor = res.data;

      const bookingData = {
        id: doctor.id,
        name: doctor.doctorName,
        contact: doctor.contact,
        address: doctor.address,
        timing: doctor.timing,
        availableDays: doctor.availableDays,
        image,
      };

      // Navigate to /booking/:id (not /book/:id) with bookingData in state
      navigate(`/booking/${id}`, {
        state: { bookingData },
      });
    } catch (err) {
      console.error("❌ Failed to fetch doctor by ID:", err);
      alert("Failed to load doctor details. Try again.");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="hospital-name">🏥 MediCare Hospital</div>
        <div className="contact-info">
          📞 +91 9876543210 | ✉️ contact@medicare.com
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="section-title">🩺 Our Expert Doctors</h1>

        <div className="card-scroll-container">
          <div className="card-row">
            {doctors.map((doc, index) => {
              const image = doctorImages[index % doctorImages.length];
              return (
                <div key={doc.id} className="doctor-card">
                  <img src={image} alt={doc.doctorName} className="doctor-img" />
                  <div className="doctor-info">
                    <h2 className="doctor-name">{doc.doctorName}</h2>
                    <p>
                      <strong>📞</strong> {doc.contact}
                    </p>
                    <p>
                      <strong>📅</strong> {doc.availableDays}
                    </p>
                    <p>
                      <strong>🕒</strong> {doc.timing}
                    </p>
                    <p>
                      <strong>📍</strong> {doc.address}
                    </p>
                    <button
                      className="book-button"
                      onClick={() => handleBooking(doc.id, image)}
                      type="button"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="query-section">
          <h2 className="query-title">💬 Got Questions?</h2>
          <p>We're here to help. Reach out for appointment support or queries.</p>
          <button className="support-button" type="button">
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
