import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Navbar from "./components/Navbars/Navbar";

import Predict from "./pages/Predicts/Predict";
import Treatment from "./pages/Treatments/Treatment";
import Statistics from "./pages/Statistics/Statistic";
import About from "./pages/Abouts/About";

function App() {

  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Predict />}></Route>
        <Route path="/treatment" element={<Treatment></Treatment>} ></Route>
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;