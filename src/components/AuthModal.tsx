import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Sparkles,
  UserCheck 
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'PIN' | 'REGISTER'>('LOGIN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('CASHIER');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      onLoginSuccess(data.user, data.token);
      onShowToast(`Welcome back, ${data.user.name}!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      onShowToast('Please enter your 4-digit PIN.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'PIN authentication failed');

      onLoginSuccess(data.user, data.token);
      onShowToast(`Terminal unlocked for ${data.user.name} (${data.user.role})!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Invalid PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          pin: pin || '1234',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      onLoginSuccess(data.user, data.token);
      onShowToast(`Account created for ${data.user.name}!`);
      onClose();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-Click Demo Profiles
  const quickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: presetEmail, password: presetPass }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          onLoginSuccess(data.user, data.token);
          onShowToast(`Logged in as ${data.user.name} (${data.user.role})`);
          onClose();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Wing AI — Terminal Authentication
              </h3>
              <p className="text-[11px] text-slate-500">
                Secure access for Business Owners, Managers & Cashiers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode('LOGIN')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              authMode === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('PIN')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              authMode === 'PIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Terminal PIN
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('REGISTER')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              authMode === 'REGISTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Mode 1: Password Login */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="george.jabley@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Sign In to POS
            </button>
          </form>
        )}

        {/* Mode 2: PIN Login */}
        {authMode === 'PIN' && (
          <form onSubmit={handlePinLogin} className="space-y-4 text-xs text-center py-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Enter Your 4-Digit Terminal PIN
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                Used for instant shift switching at the cash register
              </p>
              <input
                type="password"
                maxLength={4}
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-48 mx-auto bg-slate-50 border-2 border-emerald-500 rounded-xl py-3 text-center text-2xl font-mono tracking-widest text-slate-900 focus:outline-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || pin.length < 4}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Unlock Register
            </button>
          </form>
        )}

        {/* Mode 3: Register */}
        {authMode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Boateng"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samuel@techwokx.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                >
                  <option value="CASHIER">Cashier</option>
                  <option value="MANAGER">Store Manager</option>
                  <option value="BUSINESS_OWNER">Business Owner</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Terminal PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono tracking-widest text-center focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        {/* 1-Click Fast Demo Logins */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => quickLogin('george.jabley@gmail.com', 'admin123')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              George J (Owner)
            </button>
            <button
              type="button"
              onClick={() => quickLogin('abena@techwokx.com', 'manager123')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-blue-700 transition-colors"
            >
              Abena (Manager)
            </button>
            <button
              type="button"
              onClick={() => quickLogin('kwame@techwokx.com', 'cashier123')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-amber-700 transition-colors"
            >
              Kwame (Cashier)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
