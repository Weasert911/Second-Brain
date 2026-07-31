import { useState } from 'react';
import { DEBATE_MODES } from '../utils/constants';

function RightPanel({ agents, mode, setMode, onSummonAgent, typingAgent }) {
  const [summonInput, setSummonInput] = useState('');
  const [showSummon, setShowSummon] = useState(false);

  const handleSummon = () => {
    if (summonInput.trim()) {
      onSummonAgent(summonInput.trim());
      setSummonInput('');
      setShowSummon(false);
    }
  };

  return (
    <div className="h-full bg-[#111111] border-l border-[#222222] flex flex-col overflow-hidden">
      {/* Agent roster */}
      <div className="p-4 border-b border-[#222222]">
        <div className="text-xs text-[#666666] font-mono mb-3 uppercase tracking-wide">Agents</div>
        <div className="space-y-2.5">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 flex items-center justify-center text-[10px] font-mono font-medium"
                  style={{
                    backgroundColor: agent.color,
                    color: '#0D0D0D',
                    borderRadius: '3px',
                  }}
                >
                  {agent.name.slice(0, 3).toUpperCase()}
                </div>
                {typingAgent === agent.id && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#C8FF00] rounded-full border-2 border-[#111111]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-mono truncate"
                  style={{ color: agent.color }}
                >
                  {agent.name}
                </div>
                <div className="text-[11px] text-[#666666] truncate">{agent.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" />

      {/* Debate mode */}
      <div className="p-4 border-t border-[#222222]">
        <div className="text-xs text-[#666666] font-mono mb-2.5 uppercase tracking-wide">Mode</div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.values(DEBATE_MODES).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-2 text-xs rounded border transition-colors ${
                mode === m
                  ? 'bg-[#1A1A1A] border-[#C8FF00] text-[#C8FF00]'
                  : 'bg-[#111111] border-[#222222] text-[#666666] hover:bg-[#1A1A1A]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Add agent */}
      <div className="p-4 border-t border-[#222222]">
        {showSummon ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={summonInput}
              onChange={(e) => setSummonInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSummon()}
              placeholder="Role name"
              className="flex-1 px-3 py-2 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSummon}
              className="px-3 py-2 bg-[#C8FF00] text-[#0D0D0D] text-sm rounded"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSummon(true)}
            className="w-full py-2 border border-dashed border-[#2A2A2A] rounded text-sm text-[#666666] hover:border-[#444444] hover:text-[#B0B0B0] transition-colors"
          >
            + Add agent
          </button>
        )}
      </div>
    </div>
  );
}

export default RightPanel;
