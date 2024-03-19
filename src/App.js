import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../src/components/pages/Header";
import SetChoose from "../src/components/pages/SetChoose";
import Profile from "../src/components/pages/Profile";
import SetCreation from '../src/components/pages/SetCreation'
import SetPage from "../src/components/pages/SetPage";
const App = () => {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#5a5c5b", height: "100vh" }}>
        <Header />
        <Routes>
          <Route path="/" element={<SetChoose/>} />
          <Route exact path="/setPage/:setId" element={<SetPage/>}/>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile/creation" element={<SetCreation/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};
export default App;
