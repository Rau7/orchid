import "./App.css";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import LikedImages from "./LikedImages";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/liked_images" element={<LikedImages />} />
    </Routes>
  );
}

export default App;
