import React from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const navigate = useNavigate();

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

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Email</label>
              <input type="email" placeholder="RavenK@transitops.in" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm mb-1 uppercase tracking-wider text-[#888]">Role (RBAC)</label>
              <select className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 focus:border-amber-500 focus:outline-none appearance-none text-[#ccc]">
                <option>Dispatcher</option>
                <option>Fleet Manager</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="accent-amber-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-xl py-3 rounded-md transition-colors"
            >
              Sign In
            </button>
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
