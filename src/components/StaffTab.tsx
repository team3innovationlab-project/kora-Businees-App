import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  Key, 
  CheckCircle2, 
  TrendingUp, 
  UserCheck,
  Settings,
  Lock,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';
import { StaffMember, BusinessProfile, UserRole, RolePermissions } from '../types';

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
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // New staff form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CASHIER');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit permissions state
  const [editRole, setEditRole] = useState<UserRole>('CASHIER');
  const [editPin, setEditPin] = useState('1234');
  const [editPermissions, setEditPermissions] = useState<RolePermissions>({
    canViewDashboard: false,
    canManageExpenses: false,
    canPerformReconciliation: false,
    canManagePaymentMethods: false,
    canManageStock: false,
    canManageStaff: false,
  });

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditRole(staff.role);
    setEditPin(staff.pin || (staff.role === 'CASHIER' ? '9012' : '1234'));
    setEditPermissions(staff.permissions || {
      canViewDashboard: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
      canManageExpenses: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
      canPerformReconciliation: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
      canManagePaymentMethods: staff.role === 'BUSINESS_OWNER',
      canManageStock: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
      canManageStaff: staff.role === 'BUSINESS_OWNER',
    });
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/staff/${editingStaff.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editRole,
          pin: editPin,
          permissions: editPermissions,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update staff permissions');
      }

      const data = await res.json();
      onStaffUpdated();
      setEditingStaff(null);
      onShowToast(`Updated role permissions & PIN for ${editingStaff.name}.`);
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Could not update permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span>Staff Roster & Role-Based Access Control</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store Owner controls who can access reconciliation, expenses, dashboard overview, and payment methods. Staff access sales and POS registers by PIN.
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
        {staffList.map((staff) => {
          const perms = staff.permissions || {
            canViewDashboard: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
            canManageExpenses: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
            canPerformReconciliation: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
            canManagePaymentMethods: staff.role === 'BUSINESS_OWNER',
            canManageStock: staff.role === 'BUSINESS_OWNER' || staff.role === 'MANAGER',
            canManageStaff: staff.role === 'BUSINESS_OWNER',
          };

          return (
            <div
              key={staff.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative"
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

              {/* Performance numbers */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Sales Logged
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

              {/* Role Permissions Badges */}
              <div className="space-y-1 text-[11px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Owner-Granted Permissions:
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                    ✓ Sales Register (PIN: {staff.pin || '••••'})
                  </span>
                  {perms.canViewDashboard ? (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
                      ✓ Dashboard
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-semibold text-[10px]">
                      ✗ No Dashboard
                    </span>
                  )}
                  {perms.canManageExpenses ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
                      ✓ Expenses
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-semibold text-[10px]">
                      ✗ No Expenses
                    </span>
                  )}
                  {perms.canPerformReconciliation ? (
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[10px]">
                      ✓ Reconciliation
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-semibold text-[10px]">
                      ✗ No Reconciliation
                    </span>
                  )}
                  {perms.canManagePaymentMethods && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                      ✓ Paystack Methods
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  PIN: <strong className="text-slate-900">{staff.pin || '1234'}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(staff)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Permissions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Permissions Modal (Owner Access Control) */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    Edit Permissions for {editingStaff.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Owner controls for reconciliation, expense, dashboard & payment methods
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    System Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="CASHIER">Cashier (POS Register Only)</option>
                    <option value="STAFF">Staff Member</option>
                    <option value="MANAGER">Store Manager</option>
                    <option value="BUSINESS_OWNER">Business Owner (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    4-Digit Register Access PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 9012"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono tracking-widest text-center text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Owner Access Checkboxes */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Permissions Granted by Store Owner:
                </span>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editPermissions.canViewDashboard}
                    onChange={(e) =>
                      setEditPermissions({ ...editPermissions, canViewDashboard: e.target.checked })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Dashboard Overview Access
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Can view total revenue, estimated profits, KPI cards and today summary
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-slate-200/80">
                  <input
                    type="checkbox"
                    checked={editPermissions.canManageExpenses}
                    onChange={(e) =>
                      setEditPermissions({ ...editPermissions, canManageExpenses: e.target.checked })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Expenses Tab & Record Expense
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Can log operational costs, rent, transport, utility bills, and view total outflow
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-slate-200/80">
                  <input
                    type="checkbox"
                    checked={editPermissions.canPerformReconciliation}
                    onChange={(e) =>
                      setEditPermissions({ ...editPermissions, canPerformReconciliation: e.target.checked })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Daily Cash & MoMo Reconciliation
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Can enter physical till counts, scan customer receipts, and close the daily register
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-slate-200/80">
                  <input
                    type="checkbox"
                    checked={editPermissions.canManagePaymentMethods}
                    onChange={(e) =>
                      setEditPermissions({ ...editPermissions, canManagePaymentMethods: e.target.checked })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Payment Methods & Paystack Gateway Setup
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Can configure Paystack API keys, test/live mode, and toggle Cash/MoMo/Card channels
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Owner Permissions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <option value="CASHIER">Cashier (Sales Register Only)</option>
                    <option value="STAFF">Staff Member</option>
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
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
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
