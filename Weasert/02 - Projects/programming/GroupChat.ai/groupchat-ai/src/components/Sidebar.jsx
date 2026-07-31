import { useState } from 'react';
import { format } from 'date-fns';

function Sidebar({ debates, currentDebateId, onNewDebate, onSelectDebate, onDeleteDebate, onOpenSettings, onLogout }) {
  const [search, setSearch] = useState('');

  const filteredDebates = debates.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[260px] h-full bg-[#111111] border-r border-[#222222] flex flex-col">
      <div className="p-5 border-b border-[#222222]">
        <div className="font-mono text-lg tracking-tight">
          <span className="text-[#E8E8E8]">Group</span>
          <span className="text-[#C8FF00]">Chat</span>
          <span className="text-[#E8E8E8]">.ai</span>
        </div>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Search debates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A]"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {filteredDebates.map((debate) => (
          <div
            key={debate.id}
            onClick={() => onSelectDebate(debate)}
            className={`p-3.5 mb-1.5 rounded cursor-pointer group ${
              currentDebateId === debate.id
                ? 'bg-[#1A1A1A]'
                : 'hover:bg-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  currentDebateId === debate.id ? 'bg-[#C8FF00]' : 'bg-[#2A2A2A]'
                }`}
              />
              <span className="text-sm text-[#E8E8E8] truncate flex-1">
                {debate.title || 'Untitled Debate'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDebate(debate.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-[#666666] hover:text-[#E05454] text-xs"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-[#666666] ml-[18px]">
              {format(new Date(debate.timestamp), 'MMM d, h:mm a')}
              <span className="mx-1.5">·</span>
              {debate.messages?.length || 0} msgs
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#222222]">
        <button
          onClick={onNewDebate}
          className="w-full py-2.5 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#E8E8E8] hover:bg-[#222222] transition-colors"
        >
          + New Debate
        </button>
      </div>

      <div className="p-4 border-t border-[#222222] flex gap-2">
        <button
          onClick={onOpenSettings}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#666666] hover:text-[#B0B0B0] hover:bg-[#222222] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-[#1A1A1A] border border-[#222222] rounded text-sm text-[#666666] hover:text-[#E05454] hover:bg-[#222222] transition-colors"
            title="Sign out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
