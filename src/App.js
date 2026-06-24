import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import PortScanner from './pages/PortScanner';
import Events from './pages/Events';
import Users from './pages/Users';
import AuditLog from './pages/AuditLog';

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nw_user')); } catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem('nw_token', token);
    localStorage.setItem('nw_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nw_token');
    localStorage.removeItem('nw_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
