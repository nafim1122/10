// Re-export auth utilities from auth.jsx to allow imports without extension.
// Keeping this thin JS wrapper avoids JSX parsing issues when some files import './services/auth'.
export * from './auth.jsx';
