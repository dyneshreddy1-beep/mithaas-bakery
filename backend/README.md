# Mithaas WhatsApp AI Agent Backend

This is a lightweight Node.js/Express backend that runs a WhatsApp automation agent powered by the Google Gemini API.

The agent connects to your WhatsApp account (via scanning a QR code) and acts as an automated customer support representative for **Mithaas**, the premium sweet shop.

## Features

- **WhatsApp Web Integration**: Scan a QR code in the terminal or on a web dashboard to link your WhatsApp account (uses `@whiskeysockets/baileys`).
- **Gemini AI Integration**: Uses the Google Gemini API (`gemini-1.5-flash`) to generate answers based on a customized system instruction sheet of products, pricing, ingredients, locations, hours, coupons, and mock ordering flows.
- **Web Dashboard**: Access connection status and QR codes via a clean dark-themed dashboard on `http://localhost:3001`.
- **Typing Status Simulation**: Simulates natural response times by showing the "typing..." indicator on WhatsApp while processing.
- **In-Memory Chat History**: Stores user chat sessions to maintain context for high-quality conversational responses.

## Setup Instructions

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**:
   - Create a copy of `.env.example` named `.env`.
   - Add your Google Gemini API Key:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```
     *(If the key is not set, the agent will fall back to rule-based Mock Mode.)*

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Server**:
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. **Authenticate WhatsApp**:
   - Once started, the terminal will log a QR code.
   - Alternatively, open `http://localhost:3001` in your browser to view the QR code in a clean web dashboard.
   - Open WhatsApp on your mobile phone, go to **Settings** -> **Linked Devices** -> **Link a Device**, and scan the QR code.
   - Once linked, the agent will stay connected even if you restart the server (session data is saved inside `backend/auth_info_baileys/`).

## Project Structure

- `server.js`: The main Express server and WhatsApp client lifecycle configuration.
- `package.json`: Node dependencies and script commands.
- `.env`: API Keys and Port settings.
- `auth_info_baileys/`: Created automatically, holds auth credentials and sessions.
