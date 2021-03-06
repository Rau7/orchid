import "./App.css";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Hometwo from "./Hometwo";
import Homethree from "./Homethree";
import LikedImages from "./LikedImages";
import Statistics from "./Statistics";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Homethree />} />
      <Route exact path="/approved_images" element={<LikedImages />} />

      <Route exact path="/statistics" element={<Statistics />} />
    </Routes>
  );
}

export default App;
