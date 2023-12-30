import React, { useEffect, useState } from "react";
import "./Flashcard.css";
import share from "./share.png";
import Card from "./Card";

export default function Flashcard() {
  const [cards, setCards] = useState([]);
  const [originalCards, setOriginalCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: {}, back: {} });
  const [editingCard, setEditingCard] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("lastModified");
  const [shareButton, setShareButton] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [faceBack, setFaceBack] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/flashcards")
      .then((response) => response.json())
      .then((data) => {
        setCards(data);
        setOriginalCards(data);
      });
  }, []); //used to fetch flashcard data from a server when the component mounts. It runs only after the initial render.

  useEffect(() => {
    if (selectedCards.length > 0) {
      setShareModalVisible(true);
    } else {
      setShareModalVisible(false);
    }
  }, [selectedCards]);

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
  }; // Adds a new flashcard to the server and updates the state with the new card.

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
  }; // Adds a new flashcard to the server and updates the state with the new card.

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
    fetch(`http://localhost:3001/flashcards/${id}`, {
      method: "DELETE",
    }).then(() => setCards(cards.filter((card) => card.id !== id)));
  }; // Deletes a flashcard from the server and updates the state

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
    if (searchText.length === 0) {
      setCards(originalCards);
    } else {
      setCards(filteredCards);
    }
  }; // Filters flashcards based on a search text and updates the state

  const handleFilter = () => {
    if (filterStatus === "All") setCards(originalCards);
    else {
      const filteredCards = cards.filter(
        (card) => card.status === filterStatus
      );
      setCards(filteredCards);
    }
  }; // Filters flashcards based on a status and updates the state.

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
  }; // Sorts flashcards based on a selected option and updates the state

  const handleToggleShareModal = () => {
    setShareModalVisible(!shareModalVisible);
  }; //  toggles the visibility of the share modal.

  const handleShareSelectedCards = () => {
    const selectedCardData = selectedCards.map((cardId) => {
      const selectedCard = cards.find((card) => card.id === cardId);
      return {
        id: selectedCard.id,
        front: selectedCard.front,
        back: selectedCard.back,
        lastModified: selectedCard.lastModified,
      };
    });
    const emailBody = JSON.stringify(selectedCardData, null, 2);

    window.location.href = `mailto:?subject=Selected Cards&body=${encodeURIComponent(
      emailBody
    )}`;
  }; // prepares selected cards for sharing via email

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetOrderId) => {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData("text/plain");

    const draggedIndex = cards.findIndex(
      (card) => card.id === parseInt(draggedCardId, 10)
    );

    const updatedCards = [...cards];
    const [draggedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(targetOrderId, 0, draggedCard);

    fetch(`http://localhost:3001/flashcards/${draggedCardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: targetOrderId }), // Assuming the server supports order updates
    })
      .then((response) => response.json())
      .then((data) => {
        setCards(updatedCards);
      })
      .catch((error) => {
        console.error("Error updating card order:", error);
      });
  }; // drag-and-drop functionality for reordering flashcards; uses the HTML5 drag-and-drop API.

  const handleFace = (id) => {
    setFaceBack((prevFaces) => {
      if (prevFaces.includes(id)) {
        const updatedFaces = prevFaces.filter((faceId) => faceId !== id);

        return updatedFaces;
      } else {
        const updatedFaces = [...prevFaces, id];

        return updatedFaces;
      }
    });
  }; //  toggles the visibility of the back of a flashcard

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
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            onClick={() => handleFace(card.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={selectedCards.includes(card.id) ? "selected" : ""} // add "selected" class if the card is in the selectedCards array.
            onMouseOver={() => {
              setButtonVisible(card.id);
              setShareButton(card.id);
            }}
            onMouseLeave={() => {
              setButtonVisible(0);
              setShareButton(0);
            }}
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
              <Card
                card={card}
                shareButton={shareButton}
                share={share}
                setSelectedCards={setSelectedCards}
                buttonVisible={buttonVisible}
                setEditingCard={setEditingCard}
                handleDeleteCard={handleDeleteCard}
                faceBack={faceBack}
                selectedCards={selectedCards}
              />
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
      {shareModalVisible && (
        <div className="share-modal">
          <h2>Share Selected Cards</h2>
          <p>Select the cards you want to share:</p>
          {selectedCards.map((cardId) => (
            <div key={cardId}>{}</div>
          ))}
          <button onClick={handleShareSelectedCards}>Send via Email</button>
          <button onClick={handleToggleShareModal}>Cancel</button>
        </div>
      )}
    </div>
  );
}
