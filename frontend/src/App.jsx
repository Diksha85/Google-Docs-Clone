import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import DocsHome from "./pages/DocsHome.jsx";
import Editor from "./pages/Editor.jsx";
import ShareEditor from "./pages/ShareEditor";

// Add route for shared links


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<DocsHome />} />
     


<Route path="/share/:token" element={<ShareEditor />} />

<Route path="/editor/:id" element={<Editor />} />


      </Routes>
    </Router>
  );
}
