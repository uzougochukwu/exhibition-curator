import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Metropolitan from "./components/Metropolitan";
import { Routes, Route } from "react-router-dom";
import Harvard from "./components/Harvard";
import Home from "./components/Home";
import SpecificMetropolitan from "./components/SpecificMetropolitan";
import PersonalExhibition from "./components/PersonalExhibition";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/personalexhibition" element={<PersonalExhibition/>} />
      </Routes>
    </div>
  );
}


export default App;
