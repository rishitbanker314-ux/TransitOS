import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

export function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans">
      <div className="w-1/2 bg-[#d1d5db] p-12 flex flex-col justify-center text-slate-900">
        <h1 className="text-4xl font-bold mb-2">TransitOps</h1>
        <p className="text-lg text-slate-600 mb-12">Smart Transport Operations Platform</p>

        <div className="space-y-2">
          <p className="font-bold mb-4">One login, four roles:</p>
          <p className="text-amber-600 font-bold">• Fleet Manager</p>
          <p className="text-amber-600 font-bold">• Dispatcher</p>
          <p className="text-amber-600 font-bold">• Safety Officer</p>
          <p className="text-amber-600 font-bold">• Financial Analyst</p>
        </div>
        
        <div className="mt-auto text-sm text-slate-500">
          TRANSITOPS © 2026 · RBAC ENGE
        </div>
      </div>

      <div className="w-1/2 bg-[#111] p-12 flex flex-col justify-center text-[#ccc]">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-white mb-2">Sign in to your account</h2>
          <p className="text-sm text-[#888] mb-8">Enter your credentials to continue</p>

          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@transitops.in" 
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="accent-amber-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-xl py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#111] text-[#888]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-[#333] rounded-md shadow-sm bg-[#1a1a1a] text-sm font-medium text-white hover:bg-[#222] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-sm text-[#666]">
            <p className="mb-2">Access is scoped by role after login:</p>
            <p>• Fleet Manager -&gt; Fleet, Maintenance</p>
            <p>• Dispatcher -&gt; Dashboard, Trips</p>
            <p>• Safety Officer -&gt; Drivers, Compliance</p>
            <p>• Financial Analyst -&gt; Fuel &amp; Expenses, Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

