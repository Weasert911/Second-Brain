import { useRef, useEffect } from 'react';
import MessageCard from './MessageCard';
import TypingIndicator from './TypingIndicator';
import ConclusionCard from './ConclusionCard';
import { formatElapsedTime } from '../utils/helpers';

function ChatArea({
  messages,
  topic,
  mode,
  agents,
  isRunning,
  isPaused,
  typingAgent,
  conclusion,
  summary,
  userMessage,
  setUserMessage,
  onSendMessage,
  onStartDebate,
  onPauseResume,
  onConclude,
  onSummary,
  startTime,
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingAgent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    onStartDebate(userMessage);
    setUserMessage('');
  };

  const elapsedTime = startTime ? formatElapsedTime(startTime, Date.now()) : '0:00';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0D0D0D]">
      <div className="h-14 px-5 flex items-center justify-between border-b border-[#222222] shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-sm text-[#E8E8E8]">
            {topic || 'New Debate'}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#666666]">
          <span>{agents.length} agents</span>
          <span>·</span>
          <span>{messages.length} msgs</span>
          <span>·</span>
          <span>{elapsedTime}</span>
          <span className="ml-2 px-2.5 py-1 bg-[#1A1A1A] border border-[#222222] rounded font-mono text-xs">
            {mode}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !typingAgent && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg text-[#666666] mb-3">
                Enter a debate topic to begin
              </div>
              <div className="text-sm text-[#444444]">
                Agents will discuss and debate your topic from multiple perspectives
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageCard key={msg.id} message={msg} />
        ))}

        {typingAgent && <TypingIndicator agentId={typingAgent} agents={agents} />}

        {summary && (
          <div className="mb-4 p-4 bg-[#141414] border border-[#222222] rounded">
            <div className="text-sm text-[#C8FF00] font-mono mb-2">Summary</div>
            <div className="text-sm text-[#B0B0B0] whitespace-pre-wrap leading-relaxed">{summary}</div>
          </div>
        )}

        {conclusion && <ConclusionCard conclusion={conclusion} />}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-5 pb-4 pt-3 border-t border-[#222222] shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <button
            onClick={onPauseResume}
            disabled={!isRunning && !isPaused}
            className={`px-4 py-2 text-sm rounded border transition-colors ${
              isRunning || isPaused
                ? 'bg-[#1A1A1A] border-[#222222] text-[#E8E8E8] hover:bg-[#222222]'
                : 'bg-[#111111] border-[#1A1A1A] text-[#444444] cursor-not-allowed'
            }`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={onSummary}
            disabled={messages.length === 0}
            className={`px-4 py-2 text-sm rounded border transition-colors ${
              messages.length > 0
                ? 'bg-[#1A1A1A] border-[#222222] text-[#E8E8E8] hover:bg-[#222222]'
                : 'bg-[#111111] border-[#1A1A1A] text-[#444444] cursor-not-allowed'
            }`}
          >
            Summary
          </button>
          <button
            onClick={onConclude}
            disabled={messages.length < 3}
            className={`px-4 py-2 text-sm rounded border transition-colors ${
              messages.length >= 3
                ? 'bg-[#0F150A] border-[#C8FF00] text-[#C8FF00] hover:bg-[#1A2510]'
                : 'bg-[#111111] border-[#1A1A1A] text-[#444444] cursor-not-allowed'
            }`}
          >
            Conclude
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {messages.length === 0 ? (
            <form onSubmit={handleStart} className="flex-1 flex gap-2.5">
              <input
                ref={inputRef}
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Enter debate topic..."
                className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#C8FF00] text-[#0D0D0D] text-sm font-medium rounded hover:bg-[#B8E600] transition-colors"
              >
                Start
              </button>
            </form>
          ) : (
            <div className="flex-1 flex gap-2.5">
              <input
                ref={inputRef}
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the group something, or challenge a point..."
                className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A]"
              />
              <button
                onClick={onSendMessage}
                disabled={!userMessage.trim()}
                className={`px-5 py-3 text-sm font-medium rounded transition-colors ${
                  userMessage.trim()
                    ? 'bg-[#C8FF00] text-[#0D0D0D] hover:bg-[#B8E600]'
                    : 'bg-[#1A1A1A] text-[#444444] cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
