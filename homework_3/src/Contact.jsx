import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    const message = {
      subject: subject,
      email: email,
      text: text,
    };
    try {
      const response = await fetch("http://localhost:3001/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setEmail("");
        setSubject("");
        setText("");
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };
  return (
    <div className="container">
      <div className="container__item">
        <form className="form">
          <input
            type="text"
            className="form__field"
            placeholder="Your Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <br />
          <input
            type="email"
            className="form__field"
            placeholder="Your E-Mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            title="Enter a valid email address"
            required
          />
          <br />
          <input
            type="text"
            className="form__field"
            placeholder="Your Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn--primary btn--inside uppercase"
            onClick={handleSubmit}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
