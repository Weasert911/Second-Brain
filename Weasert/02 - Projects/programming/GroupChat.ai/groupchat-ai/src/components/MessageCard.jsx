import { formatTimestamp } from '../utils/helpers';

// Strip markdown formatting and render clean text
function formatContent(text) {
  if (!text) return '';

  // Split into lines for processing
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />);
      return;
    }

    // Bullet points: - item or * item
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-[#666666] mt-px shrink-0">-</span>
          <span>{stripBold(bulletMatch[1])}</span>
        </div>
      );
      return;
    }

    // Numbered lists: 1. item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-[#666666] font-mono text-xs mt-0.5 shrink-0">{numMatch[1]}.</span>
          <span>{stripBold(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Regular line
    elements.push(
      <div key={i} className="my-0.5">{stripBold(trimmed)}</div>
    );
  });

  return elements;
}

// Strip **bold** markers and render as actual bold
function stripBold(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find **...**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch) {
      const before = remaining.slice(0, boldMatch.index);
      if (before) parts.push(<span key={key++}>{before}</span>);
      parts.push(<strong key={key++} className="text-[#D8D8D8] font-medium">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      // Find *...* (single asterisk italic)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      if (italicMatch) {
        const before = remaining.slice(0, italicMatch.index);
        if (before) parts.push(<span key={key++}>{before}</span>);
        parts.push(<em key={key++} className="text-[#C8C8C8]">{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
  }

  return parts;
}

function MessageCard({ message }) {
  const isUser = message.agentId === 'user';
  const isSystem = message.agentId === 'system';

  if (isSystem) {
    return (
      <div className="mb-2 px-4 py-2.5">
        <span className="text-sm text-[#666666] italic">{message.content}</span>
      </div>
    );
  }

  return (
    <div
      className="message-card"
      style={{ '--agent-color': message.color || '#222222' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex items-center justify-center text-[10px] font-mono font-medium shrink-0"
            style={{
              backgroundColor: message.color || '#222222',
              color: '#0D0D0D',
              borderRadius: '3px',
            }}
          >
            {message.sender.slice(0, 3).toUpperCase()}
          </div>
          <span
            className="font-mono text-sm font-medium"
            style={{ color: message.color || '#E8E8E8' }}
          >
            {message.sender}
          </span>
          {isUser && (
            <span className="text-xs text-[#C8FF00] font-mono">YOU</span>
          )}
        </div>
        <span className="text-xs text-[#444444] font-mono">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      <div className="text-[14px] text-[#B0B0B0] leading-relaxed pl-[38px]">
        {formatContent(message.content)}
        {message.streaming && (
          <span className="inline-block w-[3px] h-4 bg-[#C8FF00] ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default MessageCard;
