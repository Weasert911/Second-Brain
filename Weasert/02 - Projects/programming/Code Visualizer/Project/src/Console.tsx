import React, { useEffect, useRef } from 'react';

interface ConsoleProps {
  logs: string[];
}

const ConsolePane: React.FC<ConsoleProps> = ({ logs }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogClass = (log: string) => {
    if (log.startsWith('Error:')) return 'text-red-400';
    if (log.startsWith('>')) return 'text-green-400';
    if (log.startsWith('Warning:')) return 'text-yellow-400';
    return 'text-gray-200';
  };

  return (
    <div
      ref={consoleRef}
      className="p-3 bg-gray-900 text-gray-200 h-full overflow-y-auto font-mono text-sm rounded-md border border-gray-700"
    >
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No output yet. Run some code to see results.
        </div>
      ) : (
        logs.map((log, i) => (
          <div key={i} className={`mb-1 ${getLogClass(log)}`}>
            {log}
          </div>
        ))
      )}
    </div>
  );
};

export default ConsolePane;
