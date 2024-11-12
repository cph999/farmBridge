import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  const handleLogOut = () => {
    setIsAuthenticated(false);

  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/home/*"
            element={
              isAuthenticated ? (
                <Home handleLogOut={handleLogOut} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
