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

function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cleveland" element={<Metropolitan2/>} />
        <Route path="/smithsonian" element={<Harvard/>} />
        <Route path="/personalexhibition" element={<PersonalExhibition/>} />
        <Route path="/combined" element={<Combined/>}/>
      </Routes>
    </div>
  );
}


export default App;
