export function setupTabs(containerSelector) {
  const tabs = document.querySelectorAll(`${containerSelector} .tab-btn`);
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from sibling tabs
      const parent = tab.closest('.tabs');
      parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      // Switch panels
      const targetId = tab.getAttribute('data-target');
      const panelsContainer = parent.nextElementSibling;
      panelsContainer.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });
}

export function setupSidebarTabs() {
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tab').forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target') + '-panel';
      document.querySelectorAll('.sidebar-panel').forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });
}

export function createKVRow(key = '', value = '') {
  const template = document.getElementById('kv-row-template');
  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('.kv-row');
  
  const keyInput = row.querySelector('.kv-key');
  const valInput = row.querySelector('.kv-val');
  
  keyInput.value = key;
  valInput.value = value;
  
  row.querySelector('.kv-remove-btn').addEventListener('click', () => {
    row.remove();
  });
  
  return row;
}

export function setupKVEditors() {
  document.querySelectorAll('.add-kv-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const container = document.getElementById(targetId);
      container.appendChild(createKVRow());
    });
  });
  
  // Initialize with one empty row
  document.getElementById('params-editor').appendChild(createKVRow());
  document.getElementById('headers-editor').appendChild(createKVRow());
}

export function getKVData(containerId) {
  const container = document.getElementById(containerId);
  const rows = container.querySelectorAll('.kv-row');
  const data = {};
  
  rows.forEach(row => {
    const key = row.querySelector('.kv-key').value.trim();
    const val = row.querySelector('.kv-val').value.trim();
    if (key) {
      data[key] = val;
    }
  });
  
  return data;
}

export function setKVData(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (Object.keys(data).length === 0) {
    container.appendChild(createKVRow());
  } else {
    for (const [key, value] of Object.entries(data)) {
      container.appendChild(createKVRow(key, value));
    }
  }
}

export function formatJSON(str) {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch (err) {
    return null; // Invalid JSON
  }
}

export function updateResponseMeta(status, time, size) {
  const statusEl = document.getElementById('res-status');
  statusEl.textContent = `Status: ${status}`;
  statusEl.className = 'status-badge';
  
  if (status >= 200 && status < 300) statusEl.classList.add('status-success');
  else if (status >= 400) statusEl.classList.add('status-error');
  else if (status >= 300) statusEl.classList.add('status-warning');

  document.getElementById('res-time').textContent = `Time: ${time} ms`;
  document.getElementById('res-size').textContent = `Size: ${size > 1024 ? (size/1024).toFixed(2) + ' KB' : size + ' B'}`;
}

export function renderList(containerId, items, onSelect, onDelete) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (items.length === 0) {
    container.innerHTML = '<li style="justify-content:center; color:var(--text-muted);">Empty</li>';
    return;
  }
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex; align-items:center; flex:1; overflow:hidden;">
        <span class="method-badge method-${item.method}">${item.method}</span>
        <span class="item-url">${item.name || item.url}</span>
      </div>
      ${onDelete ? '<button class="delete-btn" title="Delete">&times;</button>' : ''}
    `;
    
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        e.stopPropagation();
        onDelete(item);
      } else {
        onSelect(item);
      }
    });
    
    container.appendChild(li);
  });
}
