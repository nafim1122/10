# Deploying the project to GitHub + Vercel

This document shows a safe path to push this project to GitHub and deploy the *client* to Vercel. For the server (Express + MongoDB + firebase-admin) I recommend deploying to a managed Node host such as Render, Railway, or Fly; instructions for that are included below.

Important notes
- Do NOT commit your Firebase service account JSON file. Use a secret/env var instead (see below).
- This repo is a monorepo with `client/` and `server/` directories. We'll deploy the client to Vercel and the server to a Node host (or you can deploy the server as a separate Vercel project if you adapt to serverless).

Step 1 — push code to GitHub
- Update the Git remote and push the current repository to the URL you provided (example: `https://github.com/nafim1122/10.git`).
- A helper PowerShell script `deploy-to-github.ps1` is included in the repo. Run it from the repository root:

```powershell
# from repo root
.\
emove-and-push.ps1 -RemoteUrl 'https://github.com/nafim1122/10.git' -Branch 'main'
```

The script will:
- Check that `git` is available.
- Confirm the remote to push to (it will not overwrite an existing `origin` without your confirmation).
- Stage all changes, create a commit (if none exists it creates an initial commit), and push to the remote.

Step 2 — deploy the client to Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. Import the repository you just pushed (`nafim1122/10`).
3. When Vercel asks for project settings:
   - Project Root: set to `client` (this ensures Vercel builds only the client app)
   - Framework Preset: `Other` (Vite will be auto-detected or choose `Vite` if available)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel (Project Settings -> Environment Variables):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - REACT_APP_API_URL (or VITE_API_URL if your code reads that; ensure the client points to your deployed server)

5. Deploy. After build succeeds, Vercel will provide a production URL.

Step 3 — deploy the server (recommended hosts)
Option A — Render / Railway (recommended for Node + MongoDB + firebase-admin):
- Create a new service on Render or Railway and connect it to the same GitHub repo.
- Set the service's root or start command to the server folder. For Render you can use a `Docker` or Node static service and set the build/start commands; for Railway select "Deploy from GitHub" and use the `server` directory.
- Environment variables you must set on the server host:
  - MONGODB_URI (MongoDB Atlas connection string)
  - PORT (optional)
  - FIREBASE_SERVICE_ACCOUNT_JSON (the full JSON contents) OR provide the service account JSON file via the platform's secret file upload

If you use `FIREBASE_SERVICE_ACCOUNT_JSON` the server code will write it to `server-service-account.json` at startup (this repo supports that).

Option B — Deploy server to Vercel (advanced)
- Vercel supports Serverless Functions but running a long-lived Express app with SSE and firebase-admin is more complex. If you want to keep the server on Vercel, you'll need to convert endpoints to serverless functions and ensure the firebase admin initialization uses secrets from env vars.

Step 4 — point the client to the server
- After the server is deployed, copy its URL (e.g. `https://my-server.onrender.com`) and add it to the client Vercel env as `VITE_API_URL` or `REACT_APP_API_URL` depending on how your client reads it (the project uses `import.meta.env.VITE_...`).

Additional tips
- Use `FIREBASE_SERVICE_ACCOUNT_JSON` in your host's secret manager and *never* commit the JSON to git.
- If you deploy multiple instances of the server, replace the in-process SSE/EventEmitter with a pub/sub system (Redis or a hosted pub/sub) to broadcast purchase events reliably.

If you'd like, I can:
- Run the PowerShell push script (I won't run it without your confirmation) or show exact commands to run locally.
- Create a minimal `.github/workflows/vercel-deploy.yml` if you prefer a GitHub Actions flow to trigger deployments.

Tell me if you want me to create the push script now and whether it may set `origin` automatically or prompt before changing remotes.