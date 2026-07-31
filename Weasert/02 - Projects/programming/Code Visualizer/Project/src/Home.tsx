import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Code Visualizer</h1>
      <p className="text-gray-600 mb-6">
        The first visual programming learning environment built specifically for Rust, Zig, and Go.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
          <p className="text-gray-600">
            Select a language from the editor, write your code, and see real-time visualizations of execution flow, variable states, and more.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Supported Languages</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Rust (ownership, borrowing, lifetimes)</li>
            <li>Zig (memory management, error handling)</li>
            <li>Go (goroutines, concurrency, channels)</li>
            <li>Python (functions, control flow, data structures)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;