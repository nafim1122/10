const fs = require('fs');
const path = require('path');

/**
 * Helper script to write FIREBASE_SERVICE_ACCOUNT_JSON env var to disk.
 * Usage (local):
 *   Set FIREBASE_SERVICE_ACCOUNT_JSON environment variable (the JSON content)
 *   node server/scripts/write_service_account.js
 *
 * This is primarily for CI/container workflows where the JSON is provided
 * as an environment variable rather than a file on disk.
 */

function main() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON is not set. Nothing to write.');
    process.exitCode = 2;
    return;
  }
  try {
    const out = path.resolve(process.cwd(), 'server-service-account.json');
    fs.writeFileSync(out, json, { encoding: 'utf8', mode: 0o600 });
    console.log('Wrote service account JSON to', out);
  } catch (err) {
    console.error('Failed to write service account JSON to disk:', err.message);
    process.exitCode = 3;
  }
}

if (require.main === module) main();

module.exports = { main };
