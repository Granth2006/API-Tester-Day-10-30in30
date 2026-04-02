import { 
  getHistory, addToHistory, 
  getCollections, saveToCollection, removeFromCollection,
  getEnvVars, saveEnvVars, replaceEnvVars 
} from './modules/storage.js';

import { 
  setupTabs, setupSidebarTabs, setupKVEditors, 
  getKVData, setKVData, formatJSON, updateResponseMeta, renderList 
} from './modules/ui.js';

import { sendRequest } from './modules/request.js';

// DOM Elements
const reqUrl = document.getElementById('req-url');
const reqMethod = document.getElementById('req-method');
const sendBtn = document.getElementById('send-btn');
const saveBtn = document.getElementById('save-btn');
const reqBodyText = document.getElementById('req-body-text');
const reqBodyError = document.getElementById('req-body-error');

const resBodyContent = document.getElementById('res-body-content');
const resHeadersContent = document.getElementById('res-headers-content');
const formatJsonBtn = document.getElementById('format-json-btn');
const copyResBtn = document.getElementById('copy-res-btn');
const exportResBtn = document.getElementById('export-res-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupTabs('.request-tabs');
  setupTabs('.response-tabs');
  setupSidebarTabs();
  setupKVEditors();
  
  loadTheme();
  refreshSidebar();
  renderEnvVars();
  
  // Method change - disable/enable body
  reqMethod.addEventListener('change', () => {
    const isBodyAllowed = ['POST', 'PUT', 'PATCH'].includes(reqMethod.value);
    reqBodyText.disabled = !isBodyAllowed;
    if (!isBodyAllowed) reqBodyText.value = '';
  });
  
  // Format JSON request
  formatJsonBtn.addEventListener('click', () => {
    const formatted = formatJSON(reqBodyText.value);
    if (formatted) {
      reqBodyText.value = formatted;
      reqBodyError.textContent = '';
    } else if (reqBodyText.value.trim() !== '') {
      reqBodyError.textContent = 'Invalid JSON';
    }
  });

  // Validate JSON on input
  reqBodyText.addEventListener('input', () => {
    if (reqBodyText.value.trim() === '') {
      reqBodyError.textContent = '';
      return;
    }
    const formatted = formatJSON(reqBodyText.value);
    if (!formatted) reqBodyError.textContent = 'Invalid JSON';
    else reqBodyError.textContent = '';
  });

  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('api_tester_theme', isDark ? 'dark' : 'light');
    
    // Switch prism theme
    const prismLink = document.getElementById('prism-theme');
    if (isDark) {
      prismLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    } else {
      prismLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
    }
  });

  // Events
  sendBtn.addEventListener('click', handleSend);
  saveBtn.addEventListener('click', handleSave);
  
  copyResBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resBodyContent.textContent);
    const originalText = copyResBtn.textContent;
    copyResBtn.textContent = 'Copied!';
    setTimeout(() => copyResBtn.textContent = originalText, 2000);
  });
  
  exportResBtn.addEventListener('click', () => {
    const blob = new Blob([resBodyContent.textContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Env variables
  document.getElementById('add-env-btn').addEventListener('click', () => {
    const envContainer = document.getElementById('env-vars-container');
    const template = document.getElementById('kv-row-template');
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector('.kv-row');
    
    row.querySelector('.kv-remove-btn').addEventListener('click', () => {
      row.remove();
      saveEnvState();
    });
    
    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', saveEnvState);
    });
    
    envContainer.appendChild(row);
  });

  // Key shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  });
});

function loadTheme() {
  const theme = localStorage.getItem('api_tester_theme');
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.getElementById('prism-theme').href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
  }
}

async function handleSend() {
  const urlRaw = reqUrl.value.trim();
  if (!urlRaw) return alert('Please enter a URL');

  const method = reqMethod.value;
  const url = replaceEnvVars(urlRaw);
  
  // Params
  const params = getKVData('params-editor');
  let finalUrl = url;
  if (Object.keys(params).length > 0) {
    try {
      const urlObj = new URL(url);
      Object.keys(params).forEach(key => urlObj.searchParams.append(key, replaceEnvVars(params[key])));
      finalUrl = urlObj.toString();
    } catch(e) {
      // ignore invalid URL
    }
  }

  // Headers
  const rawHeaders = getKVData('headers-editor');
  const headers = {};
  Object.keys(rawHeaders).forEach(key => headers[key] = replaceEnvVars(rawHeaders[key]));
  
  // Body
  let body = null;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const rawBody = reqBodyText.value.trim();
    if (rawBody) {
      const formatted = formatJSON(rawBody);
      if (!formatted) {
        reqBodyError.textContent = 'Fix invalid JSON before sending';
        return;
      }
      body = replaceEnvVars(formatted);
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
    }
  }

  // UI Loading state
  const originalBtnText = sendBtn.textContent;
  sendBtn.textContent = 'Sending...';
  sendBtn.disabled = true;
  resBodyContent.textContent = 'Loading...';
  resBodyContent.className = '';
  resHeadersContent.textContent = '';
  
  try {
    const response = await sendRequest(finalUrl, method, headers, body);
    
    // UI Updates
    if (response.error) {
      updateResponseMeta(0, response.time, 0);
      resBodyContent.textContent = `Error: ${response.error}\n\nNote: If this is a CORS issue, check browser console or ensure the endpoint allows CORS.`;
      resBodyContent.className = 'language-text';
    } else {
      updateResponseMeta(response.status, response.time, response.size);
      
      resBodyContent.textContent = response.body;
      if (response.isJson) {
        resBodyContent.className = 'language-json';
        Prism.highlightElement(resBodyContent);
      } else {
        resBodyContent.className = 'language-text';
      }
      
      resHeadersContent.textContent = JSON.stringify(response.headers, null, 2);
      resHeadersContent.className = 'language-json';
      Prism.highlightElement(resHeadersContent);
      
      // Save history
      const reqObj = { url: urlRaw, method, params, headers: rawHeaders, body: reqBodyText.value };
      addToHistory(reqObj);
      refreshSidebar();
    }
  } finally {
    sendBtn.textContent = originalBtnText;
    sendBtn.disabled = false;
  }
}

function handleSave() {
  const urlRaw = reqUrl.value.trim();
  if (!urlRaw) return alert('Enter a URL to save request');
  const name = prompt('Enter a name for this request:', urlRaw);
  if (!name) return;
  
  const reqObj = {
    url: urlRaw,
    method: reqMethod.value,
    params: getKVData('params-editor'),
    headers: getKVData('headers-editor'),
    body: reqBodyText.value
  };
  
  saveToCollection(reqObj, name);
  refreshSidebar();
}

function refreshSidebar() {
  const history = getHistory();
  renderList('history-list', history, loadRequest);
  
  const collections = getCollections();
  renderList('collections-list', collections, loadRequest, (item) => {
    removeFromCollection(item.id);
    refreshSidebar();
  });
}

function loadRequest(req) {
  reqUrl.value = req.url;
  reqMethod.value = req.method;
  
  setKVData('params-editor', req.params || {});
  setKVData('headers-editor', req.headers || {});
  
  reqBodyText.value = req.body || '';
  
  const isBodyAllowed = ['POST', 'PUT', 'PATCH'].includes(req.method);
  reqBodyText.disabled = !isBodyAllowed;
  if (!isBodyAllowed) reqBodyText.value = '';
}

function renderEnvVars() {
  const vars = getEnvVars();
  const container = document.getElementById('env-vars-container');
  container.innerHTML = '';
  
  for (const [key, val] of Object.entries(vars)) {
    const template = document.getElementById('kv-row-template');
    const clone = template.content.cloneNode(true);
    const row = clone.querySelector('.kv-row');
    
    row.querySelector('.kv-key').value = key;
    row.querySelector('.kv-val').value = val;
    
    row.querySelector('.kv-remove-btn').addEventListener('click', () => {
      row.remove();
      saveEnvState();
    });
    
    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', saveEnvState);
    });
    
    container.appendChild(row);
  }
}

function saveEnvState() {
  const container = document.getElementById('env-vars-container');
  const vars = {};
  container.querySelectorAll('.kv-row').forEach(row => {
    const key = row.querySelector('.kv-key').value.trim();
    const val = row.querySelector('.kv-val').value.trim();
    if (key) vars[key] = val;
  });
  saveEnvVars(vars);
}
