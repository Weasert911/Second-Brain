const STORAGE_KEY = 'groupchat_debates';

export function saveDebate(debate) {
  const debates = loadDebates();
  const index = debates.findIndex((d) => d.id === debate.id);
  if (index >= 0) {
    debates[index] = debate;
  } else {
    debates.unshift(debate);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debates));
}

export function loadDebates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function loadDebate(id) {
  const debates = loadDebates();
  return debates.find((d) => d.id === id) || null;
}

export function deleteDebate(id) {
  const debates = loadDebates().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debates));
}

export function generateDebateId() {
  return `debate_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
