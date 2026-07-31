import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

interface RuntimeStatus {
  rust?: boolean;
  go?: boolean;
  zig?: boolean;
  python?: boolean;
}

const Settings: React.FC = () => {
  const [apiProvider, setApiProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [installLoading, setInstallLoading] = useState<string | null>(null);

  const handleSave = () => {
    // TODO: Save settings to local storage or backend
    console.log('Settings saved:', { apiProvider, apiKey, model, temperature });
  };

  const detectRuntimes = async () => {
    setIsLoading(true);
    try {
      const result = await invoke<string>("detect_runtime");
      setRuntimeStatus(JSON.parse(result));
    } catch (e) {
      console.error('Failed to detect runtimes', e);
    } finally {
      setIsLoading(false);
    }
  };

  const installRuntime = async (language: string) => {
    setInstallLoading(language);
    try {
      const result = await invoke<string>("install_runtime", { language });
      console.log('Installation result:', result);
      // Refresh runtime status after installation
      await detectRuntimes();
    } catch (e) {
      console.error('Failed to install runtime', e);
    } finally {
      setInstallLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">AI Provider Configuration</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
          <select
            value={apiProvider}
            onChange={(e) => setApiProvider(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="openai">OpenAI</option>
            <option value="groq">Groq</option>
            <option value="anthropic">Anthropic</option>
            <option value="xai">xAI</option>
            <option value="openrouter">OpenRouter</option>
            <option value="ollama">Ollama (Local)</option>
            <option value="lmstudio">LM Studio</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="sk-..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (0-2)</label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Runtime Management</h2>
        <p className="text-gray-600 mb-2">Check which compilers/runtimes are installed:</p>
        {runtimeStatus ? (
          <ul className="list-disc list-inside text-gray-600">
            <li className="flex justify-between items-center">
              Rust (rustc) – {runtimeStatus.rust ? '✅ Installed' : '❌ Not installed'}
              {!runtimeStatus.rust && (
                <button
                  onClick={() => installRuntime('rust')}
                  disabled={installLoading === 'rust'}
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  {installLoading === 'rust' ? 'Installing...' : 'Install'}
                </button>
              )}
            </li>
            <li className="flex justify-between items-center">
              Go (go) – {runtimeStatus.go ? '✅ Installed' : '❌ Not installed'}
              {!runtimeStatus.go && (
                <button
                  onClick={() => installRuntime('go')}
                  disabled={installLoading === 'go'}
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  {installLoading === 'go' ? 'Installing...' : 'Install'}
                </button>
              )}
            </li>
            <li className="flex justify-between items-center">
              Zig (zig) – {runtimeStatus.zig ? '✅ Installed' : '❌ Not installed'}
              {!runtimeStatus.zig && (
                <button
                  onClick={() => installRuntime('zig')}
                  disabled={installLoading === 'zig'}
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  {installLoading === 'zig' ? 'Installing...' : 'Install'}
                </button>
              )}
            </li>
            <li className="flex justify-between items-center">
              Python (python3) – {runtimeStatus.python ? '✅ Installed' : '❌ Not installed'}
              {!runtimeStatus.python && (
                <button
                  onClick={() => installRuntime('python')}
                  disabled={installLoading === 'python'}
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                >
                  {installLoading === 'python' ? 'Installing...' : 'Install'}
                </button>
              )}
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">Runtime status not detected.</p>
        )}
        <button
          onClick={detectRuntimes}
          disabled={isLoading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Detecting...' : 'Detect Runtimes'}
        </button>
      </div>
    </div>
  );
};

export default Settings;