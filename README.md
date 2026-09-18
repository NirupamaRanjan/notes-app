# Student Notes CRUD Micro-App (MERN Stack Lab)

## Student details

| Field | Value |
|---|---|
| Name | Nirupama Ranjan |
| Student ID | 2026201053 |
| Course | Full-Stack Cloud Architectures |
| GitHub repository | _https://github.com/your-username/notes-app_ |

## Overview

A decoupled full-stack notes app:

- **server/** – Node.js + Express REST API with Mongoose, running on port **5000**
- **client/** – React (Vite) UI using hooks and Axios, running on port **5173**
- **Database** – local MongoDB at `mongodb://localhost:27017/notes_db`

### REST endpoints

| Method | Route | Description | Success | Failure |
|---|---|---|---|---|
| POST | `/api/notes` | Create a note (`{ title, content }`) | `201 Created` | `400 Bad Request` |
| GET | `/api/notes` | List all notes, newest first | `200 OK` | `500` |
| DELETE | `/api/notes/:id` | Delete a note by `_id` | `200 OK` | `404 Not Found` |

## Prerequisites

- Node.js 18 or later and npm
- MongoDB Community Server running locally on the default port 27017

## Setup and run

### 1. Start MongoDB

Make sure the MongoDB daemon is running:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows: MongoDB normally runs as a service after installation
```

### 2. Start the backend (terminal 1)

```bash
cd notes-app/server
npm install
npm start
```

Expected output:

```
MongoDB connected: localhost/notes_db
Server listening on http://localhost:5000
```

### 3. Start the frontend (terminal 2)

```bash
cd notes-app/client
npm install
npm run dev
```

Open **http://localhost:5173** in the browser.

## Smoke-testing the API with curl

```bash
# Create a note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First note","content":"Hello MERN"}'

# List notes
curl http://localhost:5000/api/notes

# Delete a note (replace <id> with an _id from the list)
curl -X DELETE http://localhost:5000/api/notes/<id>
```

## Project structure

```
notes-app/
|-- .gitignore
|-- README.md
|-- screenshots/
|   |-- ui-preview.png
|   |-- delete-action.png
|-- server/
|   |-- config/db.js          # Mongoose DB connection logic
|   |-- models/Note.js        # Mongoose schema & model
|   |-- routes/noteRoutes.js  # REST API route handlers
|   |-- package.json
|   \-- server.js             # Express entry point & middleware
\-- client/
    |-- index.html
    |-- vite.config.js
    |-- package.json
    \-- src/
        |-- App.jsx           # State, form & note list
        |-- main.jsx          # React DOM root mounting
        \-- index.css         # Styling
```

## Features

- Controlled form for `title` and `content`; inputs clear after a successful save
- Notes load on mount with `useEffect` + `useState`, showing a loading indicator
- Each note shows its title, content and a localized creation date
- Delete button removes the note on the server and from the list instantly, no refresh
- Empty state message: "No notes yet — add one above!"
- Error messages when the server is unreachable or a request fails

## Run notes

- The server uses `mongodb://localhost:27017/notes_db` by default; no `.env` file is needed.
- `node_modules/` and `dist/` are excluded from the submission; run `npm install` in both `server/` and `client/`.