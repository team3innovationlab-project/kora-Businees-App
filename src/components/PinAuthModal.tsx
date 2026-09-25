import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';
import { User } from '../types';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  targetActionName?: string; // e.g. "Sales Register Access" or "Owner Override"
  onSuccess: () => void;
  isOwnerOverride?: boolean;
}

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  targetActionName = 'Sales Register Terminal',
  onSuccess,
  isOwnerOverride = false,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Expected PIN: If owner override, check '1234'; otherwise check user's pin or fallback '1234' / '9012'
  const expectedPin = isOwnerOverride ? '1234' : user?.pin || (user?.role === 'CASHIER' ? '9012' : '1234');

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(null);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === expectedPin || enteredPin === '1234') {
      onSuccess();
      setPin('');
      setError(null);
      onClose();
    } else {
      setError('Incorrect 4-digit PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xs w-full overflow-hidden shadow-2xl border border-slate-200 text-center p-6 space-y-5 animate-in fade-in">
        
        {/* Header icon & title */}
        <div className="space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isOwnerOverride ? 'Business Owner PIN Required' : 'Enter Cashier PIN'}
          </h3>
          <p className="text-xs text-slate-500">
            {isOwnerOverride
              ? `Owner permission needed for ${targetActionName}`
              : `Verify PIN to unlock ${targetActionName}`}
          </p>
        </div>

        {/* User Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 block leading-tight">
                {user?.name || 'Staff Member'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                {user?.role?.replace('_', ' ') || 'CASHIER'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
            🔒 Locked
          </span>
        </div>

        {/* 4-digit dots */}
        <div className="flex justify-center items-center gap-4 py-1">
          {[0, 1, 2, 3].map((idx) => {
            const hasChar = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all ${
                  hasChar
                    ? 'bg-emerald-600 scale-110 shadow-xs'
                    : 'bg-slate-200 border border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-16 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-base transition-colors cursor-pointer shadow-2xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onClose}
            className="w-16 h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold text-base transition-colors cursor-pointer shadow-2xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="w-16 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 font-bold text-sm transition-colors cursor-pointer"
          >
            ⌫
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Default Owner PIN: <strong className="text-slate-600">1234</strong> · Cashier PIN: <strong className="text-slate-600">9012</strong>
        </div>
      </div>
    </div>
  );
};
