# Archaeology Data Hub

A full-stack platform built with Node.js, Express, React, and MySQL, designed for archaeologists to manage artifact data and for public users to explore and learn.

## Prerequisites
- Node.js (v16+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1. Log into your local MySQL instance.
2. Run the provided `schema.sql` script located in the root directory to create the database and tables.
   ```bash
   mysql -u root -p < schema.sql
   ```
3. Make sure to open `backend/.env` and update `DB_PASSWORD` or `DB_USER` with your local MySQL credentials if they differ from the defaults (root / no password).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `localhost:5000`):
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on `localhost:5173`):
   ```bash
   npm run dev
   ```

## Creating an Archaeologist Testing Account
To test the Archaeologist features (uploading artifacts, approving requests):
1. Navigate to `http://localhost:5173/auth` in your browser.
2. Select **Sign Up**.
3. Choose "Archaeologist" from the Account Type dropdown.
4. Login with your new credentials and navigate to your Dashboard to begin uploading classified or public artifacts!
