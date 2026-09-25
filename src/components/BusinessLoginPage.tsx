import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Smartphone,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { User, BusinessProfile } from '../types';

interface BusinessLoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onNavigateToOnboarding: () => void;
  onNavigateToLanding: () => void;
  onNavigateToApp: () => void;
  business: BusinessProfile;
  allUsers: User[];
  onShowToast: (msg: string) => void;
}

export const BusinessLoginPage: React.FC<BusinessLoginPageProps> = ({
  onLoginSuccess,
  onNavigateToOnboarding,
  onNavigateToLanding,
  onNavigateToApp,
  business,
  allUsers,
  onShowToast,
}) => {
  const [activeMode, setActiveMode] = useState<'password' | 'pin'>('password');
  const [email, setEmail] = useState('george.jabley@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('wing_ai_auth_token', data.token);
      onLoginSuccess(data.user, data.token);
      onShowToast(`Welcome back, ${data.user.name}!`);
      onNavigateToApp();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinLogin = async (pinValue: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid PIN');
      }

      localStorage.setItem('wing_ai_auth_token', data.token);
      onLoginSuccess(data.user, data.token);
      onShowToast(`Cashier ${data.user.name} authenticated!`);
      onNavigateToApp();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid terminal PIN.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setActiveMode('password');
    setErrorMsg(null);
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        handlePinLogin(newPin);
      }
    }
  };

  const handleKeypadClear = () => {
    setPin('');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform Overview</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToApp}
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
          >
            Launch POS Demo Direct
          </button>
          <button
            onClick={onNavigateToOnboarding}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 transition-colors cursor-pointer"
          >
            New Business? Register
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Business Portal Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage {business.name} or access your subscription register
            </p>
          </div>

          {/* Mode Switcher: Email/Password vs Quick POS Cashier PIN */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('password');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'password'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Email
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('pin');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'pin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Counter PIN (Fast POS)
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: EMAIL & PASSWORD */}
          {activeMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">
                  Business / Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Default: <code className="text-emerald-400 font-mono">admin123</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Business Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: CASHIER TERMINAL PIN KEYPAD */}
          {activeMode === 'pin' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-slate-400 block mb-2">
                  Enter 4-Digit Terminal PIN (Owner: 1234, Manager: 5678, Cashier: 9012)
                </span>
                <div className="flex justify-center gap-3 my-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl border flex items-center justify-center text-xl font-mono font-bold ${
                        pin.length > idx
                          ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                          : 'border-slate-700 bg-slate-900 text-slate-600'
                      }`}
                    >
                      {pin.length > idx ? '●' : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="py-3 bg-slate-900 hover:bg-slate-700 rounded-xl text-base font-bold text-white transition-colors cursor-pointer active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="py-3 bg-slate-900/60 hover:bg-slate-700 text-xs font-semibold text-slate-400 rounded-xl transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="py-3 bg-slate-900 hover:bg-slate-700 rounded-xl text-base font-bold text-white transition-colors cursor-pointer active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => pin.length === 4 && handlePinLogin(pin)}
                  disabled={pin.length !== 4 || isLoading}
                  className="py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider text-center">
              Quick 1-Click Role Logins
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoUser('george.jabley@gmail.com', 'admin123')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-emerald-400 block truncate">George J</span>
                <span className="text-[10px] text-slate-400 block">Owner · PIN 1234</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoUser('abena@techwokx.com', 'manager123')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-teal-400 block truncate">Abena S</span>
                <span className="text-[10px] text-slate-400 block">Manager · PIN 5678</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoUser('kwame@techwokx.com', 'cashier123')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-amber-400 block truncate">Kwame O</span>
                <span className="text-[10px] text-slate-400 block">Cashier · PIN 9012</span>
              </button>
            </div>
          </div>

          {/* New Store Registration Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Want to onboard a new retail business? </span>
            <button
              type="button"
              onClick={onNavigateToOnboarding}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800">
        <span>Wing POS Platform · Multi-Tenant Retail Management & Paystack MoMo Gateway</span>
      </footer>
    </div>
  );
};
