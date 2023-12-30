Flashcard Application
Welcome to the Flashcard Application! This application allows you to create, edit, and organize flashcards for effective learning.

Table of Contents
Introduction
Getting Started
Prerequisites
Installation
Running the Application
React App
JSON-Server
Usage
GitHub Page
Contributing
License
Introduction
This React-based Flashcard Application allows users to create, manage, and study flashcards. It includes features such as card creation, editing, sorting, and sharing selected cards via email.

Getting Started
Prerequisites
Before running the application, ensure that you have the following prerequisites installed on your machine:

Node.js
npm
JSON-Server

Installation
Clone the repository to your local machine:

bash
Copy code:
git clone https://github.com/AsimLuna/homework_3.git

Navigate to the project directory:

bash
Copy code
cd flashcard-application
Install dependencies for the React app:

bash
Copy code
npm install
Install JSON-Server globally:

bash
Copy code
npm install -g json-server
Running the Application
React App
To start the React app, run the following command:

bash
Copy code
npm start
The app will be available at http://localhost:3000 in your web browser.

JSON-Server
To start JSON-Server, run the following command:

bash
Copy code
json-server --watch db.json --port 3001   
or npx json-server --watch db.json -p 3001
This will start the JSON-Server and serve the flashcard data from db.json at http://localhost:3001.

Usage
Visit http://localhost:3000 in your web browser to access the Flashcard Application.
Explore the application, create new cards, edit existing ones, and utilize the various features for effective flashcard management.
GitHub Page:
https://asimluna.github.io/homework_3/
For additional information and updates, visit the GitHub page.
