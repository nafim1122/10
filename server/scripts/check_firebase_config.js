const fs = require('fs');
const path = require('path');

function main() {
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
  const resolved = path.isAbsolute(envPath) ? envPath : path.resolve(process.cwd(), envPath);
  console.log('Checking Firebase service account path:', resolved);
  if (!fs.existsSync(resolved)) {
    console.error('Service account file not found at path:', resolved);
    process.exitCode = 2;
    return;
  }
  try {
    const raw = fs.readFileSync(resolved, 'utf8');
    const parsed = JSON.parse(raw);
    console.log('Found service account JSON. project_id:', parsed.project_id || '(missing project_id)');
    console.log('client_email:', parsed.client_email ? parsed.client_email : '(missing client_email)');
    console.log('\nIMPORTANT: Do NOT commit this file to source control.');
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    process.exitCode = 3;
  }
}

if (require.main === module) main();

module.exports = { main };
