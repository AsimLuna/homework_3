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
