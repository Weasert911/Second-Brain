import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import EditorPane from "./Editor";
import VisualizerPane from "./Visualizer";
import ConsolePane from "./Console";
import Navbar from "./components/Navbar";
import Home from "./Home";
import Settings from "./Settings";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [code, setCode] = useState("// Write Rust code here");
  const [logs, setLogs] = useState<string[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [visualization, setVisualization] = useState<any>(null);

  // Reset visualizer when code changes (placeholder)
  useEffect(() => {
    setElements([]);
    setVisualization(null);
  }, [code]);

  async function runCode() {
    try {
      const output = await invoke<string>("run_code", { code });
      setLogs((prev) => [...prev, `> ${output}`]);
    } catch (e: any) {
      setLogs((prev) => [...prev, `Error: ${e.message}`]);
    }
  }

  async function generateVisualization() {
    try {
      // For now, we send a dummy trace (the code itself)
      const result = await invoke<string>("generate_visualization", { trace: code });
      setVisualization(JSON.parse(result));
    } catch (e) {
      console.error('Failed to generate visualization', e);
    }
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/code"
              element={
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Code Editor</h1>
                    <button
                      onClick={generateVisualization}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Generate Visualization
                    </button>
                  </div>
                  <div className="main">
                    <div className="editor">
                      <EditorPane code={code} setCode={setCode} />
                    </div>
                    <div className="visualizer">
                      <VisualizerPane elements={visualization?.nodes || []} />
                    </div>
                  </div>
                  <div className="bottom">
                    <button onClick={runCode} className="run-button">Run</button>
                    <ConsolePane logs={logs} />
                  </div>
                </div>
              }
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
