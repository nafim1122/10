# ModelHub — Fullstack AI Model Inventory

This repository contains a client (React + Vite) and server (Express + MongoDB) for managing an inventory of AI models.

Quick start

- Server: create `server/.env` from `server/.env.example`, set `MONGODB_URI` and `FIREBASE_SERVICE_ACCOUNT_PATH`, then run in `server`:

    npm install
    npm run dev

- Client: create `client/.env` from `client/.env.example`, fill Firebase web config and `VITE_API_URL`, then run in `client`:

    npm install
    npm run dev

Notes

- Add your client domain to Firebase Authentication authorized domains if deploying to Netlify/Surge.
- The server expects a Firebase service account JSON file referenced by `FIREBASE_SERVICE_ACCOUNT_PATH`.
