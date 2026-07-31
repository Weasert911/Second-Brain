function TypingIndicator({ agentId, agents }) {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return null;

  const actions = ['analyzing', 'reviewing', 'researching', 'formulating'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  return (
    <div className="flex items-center gap-2.5 py-2.5 px-1">
      <div
        className="w-6 h-6 flex items-center justify-center text-[9px] font-mono shrink-0"
        style={{
          backgroundColor: agent.color,
          color: '#0D0D0D',
          borderRadius: '3px',
        }}
      >
        {agent.name.slice(0, 3).toUpperCase()}
      </div>
      <span className="text-sm text-[#666666]">
        {agent.name} is {action}...
      </span>
      <div className="flex items-center gap-1 ml-1">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

export default TypingIndicator;
