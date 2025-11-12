# ModelHub — AI Model Inventory

Live site: https://your-live-site.example (replace with your deployed site URL)

Features:
- Add, view, edit and delete AI model entries (name, framework, use case, dataset).
- Firebase authentication (email/password) — private routes protected.
- MongoDB (Mongoose) server stores user-specific model entries.
- Responsive single-page app using Vite + React with HashRouter for route reload safety.
- Custom toast notifications for errors and success messages (no default alert used).

Local development

1. Copy `.env.example` to `.env` and fill Firebase config and API URL.
2. Install dependencies:

   npm install

3. Run development server:

   npm run dev

Deployment notes

- Client can be deployed to Netlify, Surge, or Firebase Hosting. If using Netlify/Surge, add the domain to Firebase authorized domains.
- Server can be deployed to Vercel or any Node host. Provide `MONGODB_URI` and `FIREBASE_SERVICE_ACCOUNT_PATH` in environment.
