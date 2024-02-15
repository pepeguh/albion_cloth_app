import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SetChoose from "./components/SetChoose";
import MistSets from "./components/pages/MistSets";
import GangSets from "./components/pages/GangSets";
import Profile from "./components/pages/Profile";
import SetCreation from './components/pages/SetCreation'
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
