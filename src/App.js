import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../src/components/pages/Header";
import SetChoose from "../src/components/pages/SetChoose";
import MistSets from "../src/components/pages/MistSets";
import GangSets from "../src/components/pages/GangSets";
import Profile from "../src/components/pages/Profile";
import SetCreation from '../src/components/pages/SetCreation'
const App = () => {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#5a5c5b", height: "100vh" }}>
        <Header />
        <Routes>
          <Route path="/" element={<SetChoose/>} />
          <Route path="/mist" element={<MistSets/>} />
          <Route path="/gang" element={<GangSets/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile/creation" element={<SetCreation/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
export default App;
