// src/App.js
import React from 'react';
import './App.css';
// Remove the extra import
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginFrom/LoginForm';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
