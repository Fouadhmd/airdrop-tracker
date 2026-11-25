const KEY = 'airdrop-tracker-v1';

export function loadAirdrops() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function saveAirdrops(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function exportJSON(list) {
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'airdrops-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importJSON(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const v = JSON.parse(r.result);
        if (!Array.isArray(v)) throw new Error('not an array');
        res(v);
      } catch (e) {
        rej(e);
      }
    };
    r.onerror = rej;
    r.readAsText(file);
  });
}
