const CUSTOM_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFD93D',
  '#6C5CE7',
  '#A8E6CF',
  '#FF8B94',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
];

export function getAgentColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CUSTOM_COLORS[Math.abs(hash) % CUSTOM_COLORS.length];
}

export function getInitials(name) {
  return name.slice(0, 3).toUpperCase();
}

export function formatTimestamp(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatElapsedTime(startMs, endMs) {
  const diff = Math.floor((endMs - startMs) / 1000);
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
