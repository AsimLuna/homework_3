import React, { useEffect, useState } from "react";
import "./Flashcard.css";

export default function Flashcard() {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: {}, back: {} });
  const [editingCard, setEditingCard] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("lastModified");

  useEffect(() => {
    fetch("http://localhost:3001/flashcards")
      .then((response) => response.json())
      .then((data) => setCards(data));
  }, []);

  const handleAddCard = async () => {
    const updatedCard = {
      ...newCard,
      id: cards.length + 1,
      lastModified: new Date().toISOString(),
    };

    try {
      // Make the POST request
      const response = await fetch("http://localhost:3001/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response and update state
      const data = await response.json();
      setCards((prevCards) => [...prevCards, data]);
      setNewCard({ front: {}, back: {} });
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleUpdateCard = () => {
    const currentTime = new Date().toISOString();
    setEditingCard((prevState) => ({
      ...prevState,
      lastModified: currentTime,
    }));
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === editingCard.id ? { ...editingCard } : card
      )
    );
    setEditingCard(null);

    const updatedCard = { ...editingCard, lastModified: currentTime };
    fetch(`http://localhost:3001/flashcards/${editingCard.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCard),
    })
      .then((response) => response.json())
      .then((data) => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === editingCard.id ? { ...data } : card
          )
        );
      });
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
    fetch(`http://localhost:3001/flashcards/${id}`, {
      method: "DELETE",
    }).then(() => setCards(cards.filter((card) => card.id !== id)));
  };
  const handleSearch = () => {
    const filteredCards = cards.filter((card) =>
      Object.values(card).some((value) =>
        typeof value === "string"
          ? value.toLowerCase().includes(searchText.toLowerCase())
          : typeof value === "object" &&
            Object.values(value)
              .filter((prop) => typeof prop === "string")
              .some((prop) =>
                prop.toLowerCase().includes(searchText.toLowerCase())
              )
      )
    );
    setCards(filteredCards);
  };

  const handleFilter = () => {
    if (filterStatus === "All") return;
    const filteredCards = cards.filter((card) => card.status === filterStatus);
    setCards(filteredCards);
  };

  const handleSort = (property) => {
    const propertyPath = property.split(".");

    setCards((prevCards) =>
      [...prevCards].sort((a, b) => {
        let valueA = a;
        let valueB = b;

        propertyPath.forEach((prop) => {
          valueA = valueA[prop] || "";
          valueB = valueB[prop] || "";
        });

        return valueA.localeCompare(valueB);
      })
    );
  };

  return (
    <div className="fcard">
      <div className="intro">
        <h2>This is the Flashcard page</h2>

        <div className="SearchField">
          <input
            placeholder="Search for the text you want... "
            value={searchText}
            size={30}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="FilterStatus">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Learned">Learned</option>
            <option value="Want to Learn">Want to Learn</option>
            <option value="Noted">Noted</option>
          </select>
          <button onClick={handleFilter}>Filter</button>
        </div>

        <div className="SortFields">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="front.question">Question</option>
            <option value="back.answer">Answer</option>
            <option value="back.information">Information</option>
            <option value="lastModified">Last Modified</option>
          </select>
          <button onClick={() => handleSort(sortOption)}>Sort</button>
        </div>
      </div>

      <div className="cards">
        {cards
          // .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
          .map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              onMouseOver={() => setButtonVisible(card.id)}
              onMouseLeave={() => setButtonVisible(0)}
            >
              {editingCard?.id === card.id ? (
                <div>
                  <img width="100px" src={card.front.image} alt="Flashcard" />
                  <input
                    value={editingCard.front.question}
                    onChange={(e) =>
                      setEditingCard((prevState) => ({
                        ...prevState,
                        front: { ...prevState.front, question: e.target.value },
                      }))
                    }
                  />
                  <input
                    value={editingCard.back.answer}
                    onChange={(e) =>
                      setEditingCard((prevState) => ({
                        ...prevState,
                        back: { ...prevState.back, answer: e.target.value },
                      }))
                    }
                  />
                  <input
                    value={editingCard.back.information}
                    onChange={(e) =>
                      setEditingCard((prevState) => ({
                        ...prevState,
                        back: {
                          ...prevState.back,
                          information: e.target.value,
                        },
                      }))
                    }
                  />
                  <p>Last Modified: {card.lastModified}</p>

                  <button onClick={handleUpdateCard}>Save</button>
                </div>
              ) : (
                <div key={card.id}>
                  <img width="100px" src={card.front.image} alt="Flashcard" />
                  <p>Question: {card.front.question}</p>
                  <p>Answer: {card.back.answer}</p>
                  <p>Information: {card.back.information}</p>
                  <p>Last Modified: {card.lastModified}</p>
                  <p>Status: {card.status}</p>
                  {card.id === buttonVisible ? (
                    <div>
                      <button onClick={() => setEditingCard(card)}>Edit</button>
                      <button onClick={() => handleDeleteCard(card.id)}>
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="newCardSection">
        <h2>Add New Card</h2>
        <div className="inputContainer">
          <input
            placeholder="Image"
            onChange={(e) =>
              setNewCard({
                ...newCard,
                front: { ...newCard.front, image: e.target.value },
              })
            }
          />
          <input
            placeholder="Question"
            onChange={(e) =>
              setNewCard({
                ...newCard,
                front: { ...newCard.front, question: e.target.value },
              })
            }
          />
          <input
            placeholder="Answer"
            onChange={(e) =>
              setNewCard({
                ...newCard,
                back: { ...newCard.back, answer: e.target.value },
              })
            }
          />
          <input
            placeholder="Information"
            onChange={(e) =>
              setNewCard({
                ...newCard,
                back: { ...newCard.back, information: e.target.value },
              })
            }
          />
        </div>
        <button className="addButton" onClick={handleAddCard}>
          Add
        </button>
      </div>
    </div>
  );
}
