import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import AuthForm from "./components/AuthForm";
import ContestQuestions from "./components/ContestQuestions";
import { routes } from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth_user_deltacode");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route
          path={routes?.HOME}
          element={
            <>
              <Navbar user={user} />
              <HeroSection />
              <FeatureSection user={user} />
            </>
          }
        />
        <Route
          path="/contests/:id"
          element={
            <>
              <ContestQuestions />
            </>
          }
        />
        <Route
          path={routes?.SIGNIN}
          element={<AuthForm setUser={setUser} />}
        />
        <Route path="*" element={<Navigate to={routes?.HOME} />} />
      </Routes>
    </Router>
  );
}

export default App;
