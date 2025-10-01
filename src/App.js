import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Main from "./pages/Main";
import Signup from "./pages/Signup_login";
import Mypage from "./pages/Mypage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Routes with Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>

        {/* Routes without Navbar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
