# Firebase Setup for AI Model Inventory Manager

This guide walks you through creating a Firebase project, enabling authentication methods, creating a service account JSON key for server-side verification, and configuring your local environment.

1. Create a Firebase project
   - Go to https://console.firebase.google.com/ and create a new project (choose a descriptive name).

2. Enable Authentication
   - In the Firebase console, go to "Build > Authentication".
   - Under "Sign-in method" enable Email/Password and Google (if you want Google sign-in).
   - Under "Authorized domains" add localhost (e.g. `localhost`, `127.0.0.1`) and your dev host if needed.

3. Create a service account JSON key (for server use)
   - In the Firebase console, open "Project settings" (gear icon) -> "Service accounts" tab.
   - Click "Generate new private key" to download a JSON file.
   - Save this file somewhere safe on your development machine, e.g., `C:\keys\firebase-service-account.json` or in the project under `server/secrets/firebase-service-account.json` (do NOT commit this file).

4. Configure environment variable
   - Add the path to the service account JSON file to your server `.env` under the variable `FIREBASE_SERVICE_ACCOUNT_PATH`.
   - Example `.env` entry:
     FIREBASE_SERVICE_ACCOUNT_PATH=C:\keys\firebase-service-account.json

5. (Optional) For deployments
   - When deploying to platforms like Heroku, Vercel, or Cloud Run, either provide the service account JSON content as a secure environment variable and write it to disk at start time, or use the platform's secrets manager.
   - Avoid committing service account files to source control.

6. Verify locally
   - Use the provided `server/scripts/check_firebase_config.js` script to validate that the file exists and is valid JSON with a `project_id` field.

7. Optional: provide JSON via environment variable (containers/CI)
   - Instead of providing a file path, you can set the full service account JSON as the environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`.
   - The server will write this JSON to `server-service-account.json` at startup and use it automatically if `FIREBASE_SERVICE_ACCOUNT_PATH` is not set.
   - There's also a helper script `server/scripts/write_service_account.js` you can run in CI to write the file ahead of startup.

Security notes
- Treat service account keys like passwords. Rotate keys and revoke them if leaked.
- Use restricted roles for production service accounts.

If you want, I can also add a small helper that reads a FIREBASE_SERVICE_ACCOUNT_JSON env var and writes it to disk on server start (for container/deployment scenarios). Ask and I'll implement it.