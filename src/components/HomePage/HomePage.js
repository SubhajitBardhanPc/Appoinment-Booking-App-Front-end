// App.js - Main Application File
// This file serves as the main entry point for your MediManager application.
// It integrates all UI components and logic for managing doctor records.

import React, { useState, useEffect } from 'react'; // Import useEffect
// Importing icons from 'lucide-react' for a modern and clean UI
import { User, Phone, MapPin, Clock, Calendar, Edit2, Trash2, UserPlus, Stethoscope, XCircle } from 'lucide-react';
import "./HomePage.css";

// Main App component for the MediManager application
function App() {
    // Simulated username for display in the header, demonstrating user context
    const user = localStorage.getItem("username");
    const [username] = useState(user || "Guest"); // Fallback to 'Guest' if no username

    // State to manage the form input values for adding or editing a doctor
    const [formData, setFormData] = useState({
        doctorName: '',
        contact: '', // Changed from contactNo to contact to match backend Doctor entity
        address: '',
        timing: '',
        availableDays: ''
    });

    // State to store the list of doctors. This will hold all doctor records.
    const [doctors, setDoctors] = useState([]);

    // State to track if a doctor is currently being edited.
    // Stores the ID of the doctor; `null` if not editing.
    const [editDoctorId, setEditDoctorId] = useState(null); // Changed to store ID instead of index

    // State to store validation errors for each form field.
    // Keys correspond to input names, values are error messages.
    const [errors, setErrors] = useState({});

    // State for controlling the visibility of the custom delete confirmation modal.
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    // State to temporarily store the doctor object that is pending deletion.
    const [doctorToDelete, setDoctorToDelete] = useState(null);

    // BASE URL for your Spring Boot API
    const API_BASE_URL = 'http://localhost:8080/api/doctors';

    /**
     * Fetches all doctors from the Spring Boot backend.
     * This runs once when the component mounts.
     */
    useEffect(() => {
        fetchDoctors();
    }, []); // Empty dependency array means this runs once on mount

    const fetchDoctors = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDoctors(data); // Update React state with data from backend
        } catch (error) {
            console.error('Error fetching doctors:', error);
            // Optionally, set an error state to display to the user
        }
    };


    /**
     * Validates the current form data.
     * Checks for required fields and basic contact number format.
     * Updates the `errors` state with specific messages for invalid fields.
     * @returns {boolean} True if all form fields are valid, false otherwise.
     */
    const validateForm = () => {
        const newErrors = {}; // Object to collect all validation errors

        // Check if doctor name is provided
        if (!formData.doctorName.trim()) {
            newErrors.doctorName = 'Doctor name is required';
        }
        // Check if contact number is provided
        if (!formData.contact.trim()) { // Used formData.contact
            newErrors.contact = 'Contact number is required';
        }
        // Check if address is provided
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        // Check if timing is provided
        if (!formData.timing.trim()) {
            newErrors.timing = 'Timing is required';
        }
        // Check if available days are provided
        if (!formData.availableDays.trim()) {
            newErrors.availableDays = 'Available days are required';
        }

        // Basic phone number validation: ensures it contains at least 10 digits
        if (formData.contact && !/^\d{10,}$/.test(formData.contact.replace(/\D/g, ''))) { // Used formData.contact
            newErrors.contact = 'Please enter a valid phone number (at least 10 digits)';
        }

        setErrors(newErrors); // Update the state with the new error messages
        return Object.keys(newErrors).length === 0; // Form is valid if there are no errors
    };

    /**
     * Handles changes in any form input field.
     * Updates the `formData` state with the new value of the changed input.
     * Also clears any associated validation error for that field as the user types.
     * @param {Object} e - The event object from the input field.
     */
    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure `name` and `value` from the event target
        setFormData(prev => ({ ...prev, [name]: value })); // Update the specific field in formData

        // If there was an error for this field, clear it as the user is correcting it
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * Handles the submission of the doctor form.
     * Sends data to the backend API.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission

        if (!validateForm()) {
            return; // If validation fails, stop the function execution
        }

        try {
            let response;
            let method;
            let url;

            if (editDoctorId !== null) {
                // If `editDoctorId` is not null, we are in edit mode (PUT request)
                method = 'PUT';
                url = `${API_BASE_URL}/${editDoctorId}`;
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // If `editDoctorId` is null, we are adding a new doctor (POST request)
                method = 'POST';
                url = API_BASE_URL;
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) {
                // If the response is not OK (e.g., 400, 500 status)
                const errorData = await response.json(); // Try to parse error message from backend
                throw new Error(errorData.message || `API error! status: ${response.status}`);
            }

            // After successful POST/PUT, re-fetch all doctors to update the list
            // This ensures the table is in sync with the database, including new IDs from backend
            await fetchDoctors();

            resetForm(); // Clear the form fields and errors after submission
            setEditDoctorId(null); // Exit edit mode
        } catch (error) {
            console.error('Error submitting doctor data:', error);
            alert(`Failed to save doctor: ${error.message}`); // Display user-friendly error
        }
    };

    /**
     * Resets all form fields to their initial empty state and clears any validation errors.
     */
    const resetForm = () => {
        setFormData({
            doctorName: '',
            contact: '', // Consistent with backend
            address: '',
            timing: '',
            availableDays: ''
        });
        setErrors({}); // Clear all error messages
    };

    /**
     * Initiates the edit process for a selected doctor.
     * Populates the form with the details of the doctor to be edited.
     * @param {Object} doctorToEdit - The doctor object to be edited.
     */
    const handleEdit = (doctorToEdit) => {
        // Ensure formData matches the exact fields of the doctor object from backend
        setFormData({
            doctorName: doctorToEdit.doctorName,
            contact: doctorToEdit.contact,
            address: doctorToEdit.address,
            timing: doctorToEdit.timing,
            availableDays: doctorToEdit.availableDays
        });
        setEditDoctorId(doctorToEdit.id); // Set the ID to indicate editing mode
    };

    /**
     * Prepares for doctor deletion by setting the doctor to be deleted
     * and displaying the custom confirmation modal.
     * @param {Object} doctor - The doctor object to be deleted.
     */
    const handleDelete = (doctor) => {
        setDoctorToDelete(doctor); // Store the specific doctor object
        setShowDeleteConfirm(true); // Show the modal
    };

    /**
     * Executes the deletion of the doctor after user confirmation.
     * Sends DELETE request to the backend.
     */
    const confirmDelete = async () => {
        if (!doctorToDelete || !doctorToDelete.id) {
            console.error("No doctor selected for deletion or missing ID.");
            cancelDelete();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${doctorToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // If deletion is successful on backend, remove from local state
            setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== doctorToDelete.id));

            // If the deleted doctor was the one being edited, reset the form state
            if (editDoctorId === doctorToDelete.id) {
                resetForm();
                setEditDoctorId(null);
            }

            alert(`Doctor ${doctorToDelete.doctorName} deleted successfully!`); // User feedback
            cancelDelete(); // Hide the modal and clear temporary state
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert(`Failed to delete doctor: ${error.message}`);
            cancelDelete(); // Hide the modal even on error
        }
    };

    /**
     * Cancels the delete operation and hides the custom confirmation modal.
     */
    const cancelDelete = () => {
        setShowDeleteConfirm(false); // Hide the modal
        setDoctorToDelete(null); // Clear the temporary doctorToDelete state
    };

    /**
     * Cancels the current edit operation.
     * Resets the form fields and exits edit mode.
     */
    const handleCancel = () => {
        resetForm(); // Clear form inputs
        setEditDoctorId(null); // Exit edit mode
    };

    return (
        // Main container div with a gradient background and Inter font applied globally via CSS
        <div className="app-container">
            {/* Header Section: Sticky at the top, semi-transparent background with blur */}
            <header className="header-section">
                <div className="header-content-wrapper">
                    <div className="header-left-group">
                        {/* App Title and Logo */}
                        <div className="app-logo-container">
                            {/* Assuming Stethoscope is an icon component, it remains as is */}
                            <Stethoscope className="app-logo-icon" />
                        </div>
                        <div>
                            <h1 className="app-title">MediManager</h1>
                            <p className="welcome-text">Welcome back, {username}</p>
                        </div>
                    </div>
                    {/* User Profile Info (hidden on small screens) */}
                    <div className="user-profile-group">
                        <div className="user-text-info">
                            <p className="user-name">{username}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                        <div className="user-avatar-container">
                            {/* Assuming User is an icon component */}
                            <User className="user-avatar-icon" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area: Centered, responsive grid layout */}
            <div className="main-content-area">
                <div className="grid-layout">
                    {/* Form Section: For adding and editing doctor details */}
                    <div className="form-section">
                        <div className="form-card">
                            <div className="form-header">
                                <div className="form-icon-container">
                                    {/* Assuming UserPlus is an icon component */}
                                    <UserPlus className="form-header-icon" />
                                </div>
                                <h2 className="form-title">
                                    {editDoctorId !== null ? "Edit Doctor" : "Add New Doctor"}
                                </h2>
                            </div>

                            <div className="form-fields-group">
                                {/* Doctor Name Input Field */}
                                <div className="input-field-wrapper">
                                    <div className="input-field-relative">
                                        {/* Assuming User is an icon component */}
                                        <User className="input-icon" />
                                        <input
                                            type="text"
                                            name="doctorName"
                                            placeholder="Doctor Name"
                                            value={formData.doctorName}
                                            onChange={handleChange}
                                            className={`input-text-field ${errors.doctorName ? 'input-error-border' : ''}`}
                                        />
                                    </div>
                                    {errors.doctorName && <p className="input-error-message">{errors.doctorName}</p>}
                                </div>

                                {/* Contact Number Input Field */}
                                <div className="input-field-wrapper">
                                    <div className="input-field-relative">
                                        {/* Assuming Phone is an icon component */}
                                        <Phone className="input-icon" />
                                        <input
                                            type="tel"
                                            name="contact" // Changed to 'contact'
                                            placeholder="Contact Number"
                                            value={formData.contact} // Changed to 'contact'
                                            onChange={handleChange}
                                            className={`input-text-field ${errors.contact ? 'input-error-border' : ''}`}
                                        />
                                    </div>
                                    {errors.contact && <p className="input-error-message">{errors.contact}</p>}
                                </div>

                                {/* Address Input Field */}
                                <div className="input-field-wrapper">
                                    <div className="input-field-relative">
                                        {/* Assuming MapPin is an icon component */}
                                        <MapPin className="input-icon" />
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`input-text-field ${errors.address ? 'input-error-border' : ''}`}
                                        />
                                    </div>
                                    {errors.address && <p className="input-error-message">{errors.address}</p>}
                                </div>

                                {/* Timing Input Field */}
                                <div className="input-field-wrapper">
                                    <div className="input-field-relative">
                                        {/* Assuming Clock is an icon component */}
                                        <Clock className="input-icon" />
                                        <input
                                            type="text"
                                            name="timing"
                                            placeholder="Timing (e.g., 9:00 AM - 5:00 PM)"
                                            value={formData.timing}
                                            onChange={handleChange}
                                            className={`input-text-field ${errors.timing ? 'input-error-border' : ''}`}
                                        />
                                    </div>
                                    {errors.timing && <p className="input-error-message">{errors.timing}</p>}
                                </div>

                                {/* Available Days Input Field */}
                                <div className="input-field-wrapper">
                                    <div className="input-field-relative">
                                        {/* Assuming Calendar is an icon component */}
                                        <Calendar className="input-icon" />
                                        <input
                                            type="text"
                                            name="availableDays"
                                            placeholder="Available Days (e.g., Monday - Friday)"
                                            value={formData.availableDays}
                                            onChange={handleChange}
                                            className={`input-text-field ${errors.availableDays ? 'input-error-border' : ''}`}
                                        />
                                    </div>
                                    {errors.availableDays && <p className="input-error-message">{errors.availableDays}</p>}
                                </div>

                                {/* Form Action Buttons: Add/Update and Cancel */}
                                <div className="form-action-buttons">
                                    <button
                                        onClick={handleSubmit}
                                        className="submit-button"
                                    >
                                        {editDoctorId !== null ? "Update Doctor" : "Add Doctor"}
                                    </button>
                                    {editDoctorId !== null && (
                                        <button
                                            onClick={handleCancel}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section: Displays the list of added doctors */}
                    <div className="table-section">
                        <div className="table-card">
                            <div className="table-header">
                                <div className="table-header-left-group">
                                    <div className="table-icon-container">
                                        {/* Assuming Stethoscope is an icon component */}
                                        <Stethoscope className="table-header-icon" />
                                    </div>
                                    <h2 className="table-title">Doctors Directory</h2>
                                </div>
                                {/* Badge showing the total number of doctors */}
                                <div className="doctor-count-badge">
                                    {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Conditional rendering for empty state or doctor table */}
                            {doctors.length === 0 ? (
                                <div className="empty-state-message">
                                    {/* Assuming Stethoscope is an icon component */}
                                    <Stethoscope className="empty-state-icon" />
                                    <h3 className="empty-state-title">No doctors added yet</h3>
                                    <p className="empty-state-description">Start by adding your first doctor to the directory.</p>
                                </div>
                            ) : (
                                <div className="table-responsive-wrapper">
                                    <table className="doctors-table">
                                        <thead>
                                            <tr className="table-header-row">
                                                <th className="table-header-cell">Doctor</th>
                                                <th className="table-header-cell hidden-md">Contact</th>
                                                <th className="table-header-cell hidden-lg">Address</th>
                                                <th className="table-header-cell hidden-sm">Schedule</th>
                                                <th className="table-header-cell text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {doctors.map((doctor) => ( // No 'index' needed for key with unique ID from backend
                                                <tr key={doctor.id} className="table-row"> {/* Use doctor.id for key */}
                                                    <td className="table-cell">
                                                        <div className="doctor-info-group">
                                                            <div className="doctor-avatar-small">
                                                                {/* Assuming User is an icon component */}
                                                                <User className="doctor-avatar-icon-small" />
                                                            </div>
                                                            <div>
                                                                <p className="doctor-name-display">{doctor.doctorName}</p>
                                                                <p className="doctor-contact-mobile">{doctor.contact}</p> {/* Changed to 'contact' */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell hidden-md">
                                                        <div className="contact-info-display">
                                                            {/* Assuming Phone is an icon component */}
                                                            <Phone className="contact-icon" />
                                                            <span>{doctor.contact}</span> {/* Changed to 'contact' */}
                                                        </div>
                                                    </td>
                                                    <td className="table-cell hidden-lg">
                                                        <div className="address-info-display">
                                                            {/* Assuming MapPin is an icon component */}
                                                            <MapPin className="address-icon" />
                                                            <span className="address-text">{doctor.address}</span>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell hidden-sm">
                                                        <div className="schedule-info-group">
                                                            <div className="schedule-item">
                                                                {/* Assuming Clock is an icon component */}
                                                                <Clock className="schedule-icon" />
                                                                <span className="schedule-text">{doctor.timing}</span>
                                                            </div>
                                                            <div className="schedule-item">
                                                                {/* Assuming Calendar is an icon component */}
                                                                <Calendar className="schedule-icon" />
                                                                <span className="schedule-text">{doctor.availableDays}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell">
                                                        <div className="table-actions">
                                                            <button
                                                                onClick={() => handleEdit(doctor)} // Pass the whole doctor object
                                                                className="action-button edit-button"
                                                                title="Edit doctor"
                                                            >
                                                                {/* Assuming Edit2 is an icon component */}
                                                                <Edit2 className="action-icon" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(doctor)} // Pass the whole doctor object
                                                                className="action-button delete-button"
                                                                title="Delete doctor"
                                                            >
                                                                {/* Assuming Trash2 is an icon component */}
                                                                <Trash2 className="action-icon" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal: Appears as an overlay when showDeleteConfirm is true */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            onClick={cancelDelete}
                            className="modal-close-button"
                            title="Close"
                        >
                            {/* Assuming XCircle is an icon component */}
                            <XCircle className="modal-close-icon" />
                        </button>
                        <div className="modal-text-center">
                            {/* Assuming Trash2 is an icon component */}
                            <Trash2 className="modal-delete-icon" />
                            <h3 className="modal-title">Confirm Deletion</h3>
                            <p className="modal-description">
                                Are you sure you want to delete doctor <span className="modal-highlight-name">{doctorToDelete?.doctorName}</span>?
                                This action cannot be undone.
                            </p>
                            <div className="modal-action-buttons">
                                <button
                                    onClick={confirmDelete}
                                    className="modal-confirm-button"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="modal-cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;