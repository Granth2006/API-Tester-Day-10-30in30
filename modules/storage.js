// Storage keys
const HISTORY_KEY = 'api_tester_history';
const COLLECTIONS_KEY = 'api_tester_collections';
const ENV_KEY = 'api_tester_env';

// Make sure storage is initialized
function initStorage() {
  if (!localStorage.getItem(HISTORY_KEY)) localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  if (!localStorage.getItem(COLLECTIONS_KEY)) localStorage.setItem(COLLECTIONS_KEY, JSON.stringify([]));
  if (!localStorage.getItem(ENV_KEY)) localStorage.setItem(ENV_KEY, JSON.stringify({}));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

export function addToHistory(request) {
  const history = getHistory();
  // Generate a short ID
  request.id = Date.now().toString(36);
  request.timestamp = Date.now();
  
  history.unshift(request);
  // Keep only last 10
  if (history.length > 10) {
    history.pop();
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function getCollections() {
  return JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
}

export function saveToCollection(request, name) {
  const collections = getCollections();
  request.id = Date.now().toString(36);
  request.name = name;
  collections.push(request);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  return collections;
}

export function removeFromCollection(id) {
  const collections = getCollections().filter(r => r.id !== id);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  return collections;
}

export function getEnvVars() {
  return JSON.parse(localStorage.getItem(ENV_KEY) || '{}');
}

export function saveEnvVars(vars) {
  localStorage.setItem(ENV_KEY, JSON.stringify(vars));
}

export function replaceEnvVars(str) {
  const vars = getEnvVars();
  let result = str;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

initStorage();
