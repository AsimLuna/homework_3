import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Flashcards from "./Flashcard";
import Contact from "./Contact";
import "./App.css";

export default function App() {
  return (
    <Router>
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/flashcards">Flashcards</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </>
    </Router>
  );
}
