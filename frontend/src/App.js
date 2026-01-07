import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import Login from "./components/login";
import Events from "./components/events";
import GuestEvents from "./components/guestEvents";
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [guestView, setGuestView] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setGuestView(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setGuestView(false);
  };

  if (!token && !guestView) {
    return (
      <Login
        setToken={handleSetToken}
        setGuestView={() => setGuestView(true)}
      />
    );
  }

  if (guestView) {
    return <GuestEvents />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        Welcome! You are logged in as {user?.email} ({user?.role})
      </h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>
      <Events token={token} user={user} />
    </div>
  );
}

export default App;
