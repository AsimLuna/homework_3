import React, { useState } from "react";
import Home from "./Home";
import "./App.css";
import Flashcards from "./Flashcard";
import Contact from "./Contact";

export default function App() {
  const [page, setPage] = useState("Home");

  const renderPage = () => {
    if (page === "Home") return <Home />;
    if (page === "Flashcards") return <Flashcards />;
    if (page === "Contact") return <Contact />;
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li onClick={() => setPage("Home")}>Home</li>
          <li onClick={() => setPage("Flashcards")}>Flashcards</li>
          <li onClick={() => setPage("Contact")}>Contact</li>
        </ul>
      </nav>
    </div>
  );
}
