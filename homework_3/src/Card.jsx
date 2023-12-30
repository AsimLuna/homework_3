import "./Card.css";
export default function Card({
  card,
  shareButton,
  share,
  setSelectedCards,
  buttonVisible,
  setEditingCard,
  handleDeleteCard,
  faceBack,
  selectedCards,
}) {
  return (
    <div>
      {!faceBack.includes(card.id) & !selectedCards.includes(card.id) ? (
        <p>Question: {card.front.question}</p>
      ) : (
        <>
          <img
            width="100px"
            src={card.front.image}
            alt="Flashcard"
            style={{ position: "relative" }}
          />
          {shareButton === card.id ? (
            <img
              src={share}
              alt="share"
              id="share"
              style={{ position: "absolute", right: "5px", top: "5px" }}
              onClick={() => {
                setSelectedCards((prevSelected) =>
                  prevSelected.includes(card.id)
                    ? prevSelected.filter((id) => id !== card.id)
                    : [...prevSelected, card.id]
                );
              }}
            />
          ) : (
            <div></div>
          )}
          <p>Answer: {card.back.answer}</p>
          <p>Information: {card.back.information}</p>
          <p>Last Modified: {card.lastModified}</p>
          <p>Status: {card.status}</p>
          {card.id === buttonVisible ? (
            <div>
              <button onClick={() => setEditingCard(card)}>Edit</button>
              <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
    </div>
  );
}
