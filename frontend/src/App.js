import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import FindJobs from "@/pages/FindJobs";
import FindTalents from "@/pages/FindTalents";
import AboutUs from "@/pages/AboutUs";
import Testimonials from "@/pages/Testimonials";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/find-talents" element={<FindTalents />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;