import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import LocalStorageUtil from './utils/LocalStorageUtil.js';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const websocketRef = useRef(null);
  const [userinfo, setUserinfo] = useState({})
  const handleLoginSuccess = () => {
    const u = LocalStorageUtil.getItem("userinfo")
    // const ws = new WebSocket(`wss://localhost:8809/chat?userId=${useri}`);
    if (u != null && u !== undefined && JSON.stringify(u) !== '{}') {

      const ws = new WebSocket(`ws://localhost:8809/chat?userId=${u.id}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {

      };

      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      websocketRef.current = ws;

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
    setIsAuthenticated(true);
  };
  const handleLogOut = () => {
    setIsAuthenticated(false);

  }

  useEffect(() => {
    if (userinfo !== undefined && userinfo !== null && JSON.stringify(userinfo) !== '{}') {
      setIsAuthenticated(true)
    }
  }, [userinfo]);


  useEffect(() => {
    setUserinfo(LocalStorageUtil.getItem("userinfo"))
    const u = LocalStorageUtil.getItem("userinfo")
    // const ws = new WebSocket(`wss://localhost:8809/chat?userId=${useri}`);
    if (u != null && u !== undefined && JSON.stringify(u) !== '{}') {

      const ws = new WebSocket(`ws://localhost:8809/chat?userId=${u.id}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {

      };

      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      websocketRef.current = ws;

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, []);


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
