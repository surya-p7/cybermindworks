import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobPortal from "@/components/JobPortal";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JobPortal />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;