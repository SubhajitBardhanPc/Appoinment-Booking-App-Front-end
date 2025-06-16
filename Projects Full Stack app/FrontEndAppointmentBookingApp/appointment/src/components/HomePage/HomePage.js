// App.js - Main Application File
// This file serves as the main entry point for your MediManager application.
// It integrates all UI components and logic for managing doctor records.

import React, { useState } from 'react';
// Importing icons from 'lucide-react' for a modern and clean UI
import { User, Phone, MapPin, Clock, Calendar, Edit2, Trash2, UserPlus, Stethoscope, XCircle } from 'lucide-react';
import "./HomePage.css";
// Main App component for the MediManager application
function App() {
  // Simulated username for display in the header, demonstrating user context
  const [username] = useState("Dr. Smith");

  // State to manage the form input values for adding or editing a doctor
  const [formData, setFormData] = useState({
    doctorName: '',
    contactNo: '',
    address: '',
    timing: '',
    availableDays: ''
  });

  // State to store the list of doctors. This will hold all doctor records.
  const [doctors, setDoctors] = useState([]);

  // State to track if a doctor is currently being edited.
  // Stores the index of the doctor in the `doctors` array; `null` if not editing.
  const [editIndex, setEditIndex] = useState(null);

  // State to store validation errors for each form field.
  // Keys correspond to input names, values are error messages.
  const [errors, setErrors] = useState({});

  // State for controlling the visibility of the custom delete confirmation modal.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // State to temporarily store the doctor object that is pending deletion.
  const [doctorToDelete, setDoctorToDelete] = useState(null);


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
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
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
    // The `.replace(/\D/g, '')` removes all non-digit characters before testing.
    if (formData.contactNo && !/^\d{10,}$/.test(formData.contactNo.replace(/\D/g, ''))) {
      newErrors.contactNo = 'Please enter a valid phone number (at least 10 digits)';
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
   * Prevents the default form submission behavior.
   * Validates the form; if valid, adds a new doctor or updates an existing one, then resets the form.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (!validateForm()) {
      return; // If validation fails, stop the function execution
    }

    const updatedDoctors = [...doctors]; // Create a shallow copy of the doctors array for immutability
    if (editIndex !== null) {
      // If `editIndex` is not null, we are in edit mode
      // Update the existing doctor's details while preserving its original ID
      updatedDoctors[editIndex] = { ...formData, id: doctors[editIndex].id };
      setEditIndex(null); // Exit edit mode after updating
    } else {
      // If `editIndex` is null, we are adding a new doctor
      // Assign a unique ID using `Date.now()` (timestamp)
      updatedDoctors.push({ ...formData, id: Date.now() });
    }

    setDoctors(updatedDoctors); // Update the main doctors list state
    resetForm(); // Clear the form fields and errors after submission
  };

  /**
   * Resets all form fields to their initial empty state and clears any validation errors.
   */
  const resetForm = () => {
    setFormData({
      doctorName: '',
      contactNo: '',
      address: '',
      timing: '',
      availableDays: ''
    });
    setErrors({}); // Clear all error messages
  };

  /**
   * Initiates the edit process for a selected doctor.
   * Populates the form with the details of the doctor to be edited.
   * @param {number} index - The array index of the doctor to be edited.
   */
  const handleEdit = (index) => {
    setFormData({ ...doctors[index] }); // Copy the doctor's data to the form
    setEditIndex(index); // Set the index to indicate editing mode
  };

  /**
   * Prepares for doctor deletion by setting the doctor to be deleted
   * and displaying the custom confirmation modal.
   * @param {number} index - The array index of the doctor to be deleted.
   */
  const handleDelete = (index) => {
    setDoctorToDelete(doctors[index]); // Store the specific doctor object
    setShowDeleteConfirm(true); // Show the modal
  };

  /**
   * Executes the deletion of the doctor after user confirmation.
   * Filters the `doctors` array to remove the selected doctor.
   * Also resets the form if the deleted doctor was currently being edited.
   */
  const confirmDelete = () => {
    if (doctorToDelete) {
      // Filter out the doctor with the matching ID
      const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorToDelete.id);
      setDoctors(updatedDoctors); // Update the doctors list

      // If the deleted doctor was the one being edited, reset the form state
      if (editIndex !== null && doctors[editIndex]?.id === doctorToDelete.id) {
        resetForm();
        setEditIndex(null);
      }
    }
    setShowDeleteConfirm(false); // Hide the modal
    setDoctorToDelete(null); // Clear the temporary doctorToDelete state
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
    setEditIndex(null); // Exit edit mode
  };

  return (
    // Main container div with a gradient background and Inter font applied globally via CSS
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter">
      {/* Header Section: Sticky at the top, semi-transparent background with blur */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* App Title and Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MediManager</h1>
                <p className="text-blue-200 text-sm">Welcome back, {username}</p>
              </div>
            </div>
            {/* User Profile Info (hidden on small screens) */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{username}</p>
                <p className="text-blue-200 text-sm">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Centered, responsive grid layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section: For adding and editing doctor details */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {editIndex !== null ? "Edit Doctor" : "Add New Doctor"}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Doctor Name Input Field */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="doctorName"
                      placeholder="Doctor Name"
                      value={formData.doctorName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.doctorName ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.doctorName && <p className="text-red-400 text-sm mt-1">{errors.doctorName}</p>}
                </div>

                {/* Contact Number Input Field */}
                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="contactNo"
                      placeholder="Contact Number"
                      value={formData.contactNo}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.contactNo ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.contactNo && <p className="text-red-400 text-sm mt-1">{errors.contactNo}</p>}
                </div>

                {/* Address Input Field */}
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.address ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Timing Input Field */}
                <div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="timing"
                      placeholder="Timing (e.g., 9:00 AM - 5:00 PM)"
                      value={formData.timing}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.timing ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.timing && <p className="text-red-400 text-sm mt-1">{errors.timing}</p>}
                </div>

                {/* Available Days Input Field */}
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="availableDays"
                      placeholder="Available Days (e.g., Monday - Friday)"
                      value={formData.availableDays}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.availableDays ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.availableDays && <p className="text-red-400 text-sm mt-1">{errors.availableDays}</p>}
                </div>

                {/* Form Action Buttons: Add/Update and Cancel */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105"
                  >
                    {editIndex !== null ? "Update Doctor" : "Add Doctor"}
                  </button>
                  {editIndex !== null && (
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Section: Displays the list of added doctors */}
          <div className="lg:col-span-7">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Doctors Directory</h2>
                </div>
                {/* Badge showing the total number of doctors */}
                <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Conditional rendering for empty state or doctor table */}
              {doctors.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No doctors added yet</h3>
                  <p className="text-gray-400">Start by adding your first doctor to the directory.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-white text-sm">
                    <thead>
                      <tr className="bg-white/10 border-b border-white/20">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Doctor</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium hidden md:table-cell">Contact</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium hidden lg:table-cell">Address</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium hidden sm:table-cell">Schedule</th>
                        <th className="text-center py-3 px-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor, index) => (
                        <tr key={doctor.id || index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{doctor.doctorName}</p>
                                <p className="text-gray-400 text-xs md:hidden">{doctor.contactNo}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300 hidden md:table-cell">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span>{doctor.contactNo}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300 hidden lg:table-cell">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-xs">{doctor.address}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300 hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs">{doctor.timing}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-xs">{doctor.availableDays}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(index)}
                                className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all transform hover:scale-105"
                                title="Edit doctor"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all transform hover:scale-105"
                                title="Delete doctor"
                              >
                                <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700 w-full max-w-sm relative">
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete doctor <span className="font-medium text-white">{doctorToDelete?.doctorName}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Inline styles for the App. This helps keep all React and styling in one file for simpler deployment */}
      
    </div>
  );
}

export default App;