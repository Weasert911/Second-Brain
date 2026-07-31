import { useState } from 'react';
import { register, login } from '../utils/backendApi';

export default function AuthModal({ onAuth, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = isLogin
        ? await login(username, password)
        : await register(username, password);
      onAuth(data.token);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[var(--dynamic-surface,#111)] border border-[var(--dynamic-border,#222)] rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[var(--dynamic-input,#1A1A1A)] border border-[var(--dynamic-border,#222)] rounded px-3 py-2 text-white text-sm"
          />
          <input
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--dynamic-input,#1A1A1A)] border border-[var(--dynamic-border,#222)] rounded px-3 py-2 text-white text-sm"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-[var(--dynamic-accent,#C8FF00)] text-black py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-400 mt-3 hover:text-white">
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
