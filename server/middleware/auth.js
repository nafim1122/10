const admin = require('firebase-admin');
const fs = require('fs');
const nodePath = require('path');

function initFirebase() {
  if (admin.apps && admin.apps.length) return;

  // Accept either a file path (FIREBASE_SERVICE_ACCOUNT_PATH) or a
  // JSON string (FIREBASE_SERVICE_ACCOUNT_JSON). The latter is useful
  // for container deployments where secrets are provided as env vars.
  let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  // If JSON is provided but no path, write it to a local file that we can
  // load. We write to the project root to keep things simple.
  if (!serviceAccountPath && serviceAccountJson) {
    try {
      const out = nodePath.resolve(process.cwd(), 'server-service-account.json');
      if (!fs.existsSync(out)) {
        fs.writeFileSync(out, serviceAccountJson, { encoding: 'utf8', mode: 0o600 });
        console.log('Wrote FIREBASE_SERVICE_ACCOUNT_JSON to', out);
      }
      serviceAccountPath = out;
    } catch (err) {
      console.error('Failed to write service account JSON to disk:', err.message);
      return;
    }
  }

  if (!serviceAccountPath) {
    console.error('FIREBASE_SERVICE_ACCOUNT_PATH not set and FIREBASE_SERVICE_ACCOUNT_JSON not provided');
    return;
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase admin initialized for project:', serviceAccount.project_id || '(unknown)');
  } catch (err) {
    console.error('Failed to initialize Firebase admin:', err.message);
  }
}

initFirebase();

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const idToken = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    console.error('Token verification failed', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { initFirebase, verifyToken };
