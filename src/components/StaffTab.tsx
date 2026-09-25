import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  Key, 
  CheckCircle2, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';
import { StaffMember, BusinessProfile, UserRole } from '../types';

interface StaffTabProps {
  staffList: StaffMember[];
  business: BusinessProfile;
  onStaffUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staffList,
  business,
  onStaffUpdated,
  onShowToast,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CASHIER');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: password || 'pass123',
          role,
          phone,
          pin: pin || '1234',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add staff');
      }

      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setPin('');
      onStaffUpdated();
      onShowToast(`Staff member "${name}" registered with role ${role}.`);
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Failed to add staff.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Staff Roster & Cashier Performance</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage terminal logins, 4-digit POS access PINs, role-based permissions, and individual sales volume.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {staff.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                  <span className="text-xs text-slate-500">{staff.email}</span>
                </div>
              </div>

              <span
                className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  staff.role === 'BUSINESS_OWNER'
                    ? 'bg-purple-100 text-purple-800'
                    : staff.role === 'MANAGER'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {staff.role.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Sales Count
                </span>
                <span className="font-extrabold text-slate-800 text-sm font-sans">
                  {staff.totalSalesCount} orders
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Total Revenue
                </span>
                <span className="font-extrabold text-emerald-700 text-sm font-sans">
                  {business.currency} {staff.totalSalesRevenue.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                PIN: ••••
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Terminal
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Add New Staff Member
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name *
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
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. samuel@techwokx.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    Terminal PIN (4 digits)
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
                  Login Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter initial password..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
