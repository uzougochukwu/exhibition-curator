import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Metropolitan from "./components/Metropolitan";
import { Routes, Route } from "react-router-dom";
import Harvard from "./components/Harvard";
import Home from "./components/Home";
import SpecificMetropolitan from "./components/SpecificMetropolitan";
import PersonalExhibition from "./components/PersonalExhibition";
import Metropolitan2 from "./components/Metropolitan2";
import Combined from "./components/Combined";
import harvard_api_key from "./extra/API-KEY";
import SpecificHarvard2 from "./components/SpecificHarvard2";
import SpecificCleveland from "./components/SpecificCleveland";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cleveland" element={<Metropolitan2 />} />
        <Route path="/smithsonian" element={<Harvard />} />
        <Route path="/personalexhibition" element={<PersonalExhibition />} />
        <Route path="/combined" element={<Combined />} />
        <Route path="/exhibition/:artworkid" element={<SpecificHarvard2 />} />
        <Route path="/artworks/:artworkid" element={<SpecificCleveland />} />
      </Routes>
    </div>
  );
}

export default App;
