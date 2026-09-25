import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { User } from '../types';
import { PinAuthModal } from './PinAuthModal';

interface LockedTabBannerProps {
  tabName: string;
  currentUser: User | null;
  onUnlockSuccess: () => void;
  onNavigateToSales: () => void;
  onSwitchUser?: (userId: string) => void;
  allUsers?: User[];
}

export const LockedTabBanner: React.FC<LockedTabBannerProps> = ({
  tabName,
  currentUser,
  onUnlockSuccess,
  onNavigateToSales,
  onSwitchUser,
  allUsers = [],
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl text-center space-y-6">
        
        {/* Lock Icon */}
        <div className="w-18 h-18 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Heading & Text */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            ROLE-BASED ACCESS CONTROL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {tabName} is Restricted by Store Owner
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            You are logged in as <strong className="text-slate-900">{currentUser?.name || 'Staff Member'}</strong> ({currentUser?.role?.replace('_', ' ') || 'CASHIER'}).
            Reconciliation, expenses, dashboard metrics, and payment method settings require Owner authorization.
          </p>
        </div>

        {/* Permissions Breakdown Info */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
          <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
            Store Role Policy:
          </span>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-600">Sales Register & POS Terminal:</span>
            <span className="font-bold text-emerald-700">✓ Granted (Staff PIN)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-600">{tabName} Access:</span>
            <span className="font-bold text-rose-600">✗ Owner Permission Required</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600">Payment Gateway & Paystack Setup:</span>
            <span className="font-bold text-slate-900">Owner Only</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Unlock with Business Owner PIN (1234)</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToSales}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Return to Sales Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Switch to Owner user option */}
        {allUsers.length > 0 && onSwitchUser && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Or switch account to:</span>
            {allUsers
              .filter((u) => u.role === 'BUSINESS_OWNER')
              .map((owner) => (
                <button
                  key={owner.id}
                  onClick={() => onSwitchUser(owner.id)}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {owner.name} (Owner)
                </button>
              ))}
          </div>
        )}

      </div>

      <PinAuthModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        user={currentUser}
        targetActionName={tabName}
        isOwnerOverride={true}
        onSuccess={onUnlockSuccess}
      />
    </div>
  );
};
