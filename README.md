# Inventory Management System - Setup Guide

Welcome! This guide will help you get the Inventory Management System up and running on your computer. Follow these simple steps one by one.

## 1. Prerequisites (Tools you need)

Before you start, make sure you have these two things installed on your computer:

1.  **Node.js**: This is used to run the application.
    *   Download and install it from [nodejs.org](https://nodejs.org/).
    *   Choose the "LTS" version (it's the most stable).
2.  **PostgreSQL**: This is the database where all your information will be stored.
    *   Download and install it from [postgresql.org](https://www.postgresql.org/download/).
    *   During installation, remember the password you set for the "postgres" user.

---

## 2. Setting Up the Database

1.  Open **pgAdmin 4** (it comes with the PostgreSQL installation).
2.  In the menu on the left, right-click on **Databases** and select **Create** -> **Database...**.
3.  Name the database `neondb` (or any name you prefer, but remember it).
4.  Click **Save**.

---

## 3. Configuration (Connecting the App to the Database)

1.  Open the folder where the source code is located.
2.  Go into the `backend` folder.
3.  Look for a file named `.env`. If it doesn't exist, create a new one using Notepad.
4.  Copy and paste the following line into that file, replacing the placeholder information with your own:
    ```text
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/neondb
    PORT=3001
    ```
    *   Replace `YOUR_PASSWORD` with the password you set during the PostgreSQL installation.
    *   Replace `neondb` if you gave your database a different name.

---

## 4. Installing the App

You'll need to do this twice: once for the backend and once for the frontend.

### Step A: Backend
1.  Open your computer's terminal (or Command Prompt).
2.  Navigate to the `backend` folder.
3.  Type this command and press Enter:
    ```bash
    npm install
    ```

### Step B: Frontend (Client)
1.  In the same terminal, navigate to the `client` folder.
2.  Type this command and press Enter:
    ```bash
    npm install
    ```

---

## 5. Running the Application

To use the system, you must have **two** terminals open at the same time:

### Terminal 1: Start the Backend
1.  Navigate to the `backend` folder.
2.  Type this command and press Enter:
    ```bash
    npm run dev
    ```
    *   You should see a message saying "PostgreSQL connected successfully" and "Server running on port 3001".

### Terminal 2: Start the Frontend (The Visual Interface)
1.  Open a second terminal.
2.  Navigate to the `client` folder.
3.  Type this command and press Enter:
    ```bash
    npm run dev
    ```
    *   This will give you a link (usually `http://localhost:5173`).
    *   **Ctrl+Click** that link or copy-paste it into your web browser.

**Congratulations! Your Inventory Management System is now ready to use.**

---

## Troubleshooting

*   **Database connection error**: If the backend says it can't connect, double-check your password in the `.env` file and make sure PostgreSQL is running.
---

## ⚡ Quick Start Summary

If you are in a hurry, just do this:

1.  **Open two terminal windows.**
2.  **In the first terminal:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **In the second terminal:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
4.  **Open your browser** and go to: `http://localhost:5173`

Enjoy using your new system!
