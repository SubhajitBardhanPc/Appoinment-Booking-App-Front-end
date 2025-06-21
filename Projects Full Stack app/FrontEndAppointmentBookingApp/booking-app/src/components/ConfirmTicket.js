import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import "./ConfirmTicket.css";

function ConfirmTicket() {
  const location = useLocation();
  const { doctor, patient } = location.state || {};
  const ticketRef = useRef(null);

  if (!doctor || !patient) return <p className="error-msg">❌ Invalid ticket data</p>;

  const ticketInfo = {
    doctorName: doctor.name,
    patientName: patient.name,
    contact: patient.phone,
    time: doctor.timing,
    date: doctor.availableDays,
    address: doctor.address,
  };

  // 📥 Download as image
  const handleDownload = () => {
    if (!ticketRef.current) return;

    html2canvas(ticketRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Appointment_Ticket_${ticketInfo.patientName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="ticket-wrapper">
      <div className="ticket-card" ref={ticketRef}>
        <h1 className="ticket-title">✅ Appointment Confirmed</h1>

        <div className="ticket-detail">
          <span className="label">Doctor:</span>
          <span className="value">{ticketInfo.doctorName}</span>
        </div>
        <div className="ticket-detail">
          <span className="label">Patient:</span>
          <span className="value">{ticketInfo.patientName}</span>
        </div>
        <div className="ticket-detail">
          <span className="label">Contact:</span>
          <span className="value">{ticketInfo.contact}</span>
        </div>
        <div className="ticket-detail">
          <span className="label">Date:</span>
          <span className="value">{ticketInfo.date}</span>
        </div>
        <div className="ticket-detail">
          <span className="label">Time:</span>
          <span className="value">{ticketInfo.time}</span>
        </div>
        <div className="ticket-detail">
          <span className="label">Address:</span>
          <span className="value">{ticketInfo.address}</span>
        </div>

        <div className="qr-code-container">
          <QRCodeCanvas value={JSON.stringify(ticketInfo)} size={180} />
          <p className="qr-instruction">📲 Scan this QR code at the hospital reception</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: "600",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#064e3b",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(6, 78, 59, 0.7)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#023827")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#064e3b")}
      >
        📥 Download Ticket
      </button>
    </div>
  );
}

export default ConfirmTicket;
