import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nw_user")); } catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem("nw_token", token);
    localStorage.setItem("nw_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("nw_token");
    localStorage.removeItem("nw_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;