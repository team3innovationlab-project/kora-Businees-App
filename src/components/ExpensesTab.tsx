import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Calendar, 
  Filter, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Download
} from 'lucide-react';
import { Expense, BusinessProfile, PaymentMethod } from '../types';
import { exportToCsv } from '../utils/exportCsv';

interface ExpensesTabProps {
  expenses: Expense[];
  business: BusinessProfile;
  selectedDate: string;
  onExpenseAdded: () => void;
  onShowToast: (msg: string) => void;
}

const CATEGORIES: Expense['category'][] = [
  'Stock/Inventory',
  'Rent',
  'Utilities',
  'Transport',
  'Staff Pay',
  'Packaging',
  'Maintenance',
  'Other',
];

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses,
  business,
  selectedDate,
  onExpenseAdded,
  onShowToast,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState<Expense['category']>('Stock/Inventory');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [date, setDate] = useState(selectedDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredExpenses = expenses.filter((e) => {
    return filterCategory === 'All' || e.category === filterCategory;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      onShowToast('Please enter a valid expense amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          amount: parsedAmount,
          description,
          paymentMethod,
          date,
        }),
      });

      if (!res.ok) throw new Error('Failed to record expense');

      setShowAddModal(false);
      setAmount('');
      setDescription('');
      onExpenseAdded();
      onShowToast(`Recorded expense of ${business.currency} ${parsedAmount.toFixed(2)}`);
    } catch (err) {
      console.error('Error recording expense:', err);
      onShowToast('Failed to record expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredExpenses.length === 0) {
      onShowToast('No expense records to export.');
      return;
    }

    const headers = [
      'Date',
      'Time',
      'Expense Category',
      'Amount (GHS)',
      'Description',
      'Payment Method',
      'Recorded By',
    ];

    const rows = filteredExpenses.map((e) => [
      e.date,
      e.time,
      e.category,
      e.amount.toFixed(2),
      e.description,
      e.paymentMethod,
      e.recordedBy,
    ]);

    const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_expenses_${new Date().toISOString().split('T')[0]}`;
    exportToCsv(filename, headers, rows);
    onShowToast(`Exported ${filteredExpenses.length} expense entries to CSV!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-red-600" />
            <span>Operational Cash Outflows & Expenses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log inventory acquisitions, utility bills, logistics, and overhead to maintain accurate net margins.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Download expenses to CSV for accounting"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Filter bar & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Total Logged Expenses
          </span>
          <span className="text-2xl font-extrabold text-red-600 font-sans block mt-1">
            {business.currency} {totalExpenseAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Entries Count
          </span>
          <span className="text-2xl font-extrabold text-slate-800 font-sans block mt-1">
            {filteredExpenses.length} records
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
              Category Filter
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Filter className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Expenses List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Expense Activity Log
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No expenses recorded for this filter. Click "Record Expense" to add your first expense.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Paid Via</th>
                  <th className="px-6 py-3">Recorded By</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 text-slate-700 whitespace-nowrap">
                      <span className="font-semibold block">{exp.date}</span>
                      <span className="text-[10px] text-slate-400">{exp.time}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-800 font-medium">
                      {exp.description}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        {exp.paymentMethod === 'CASH' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        {exp.paymentMethod === 'MOMO' && <Smartphone className="w-3.5 h-3.5 text-amber-600" />}
                        {exp.paymentMethod === 'CARD' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{exp.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {exp.recordedBy}
                    </td>
                    <td className="px-6 py-3.5 text-right font-extrabold text-red-600 font-sans text-sm">
                      {business.currency} {exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Record Operational Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Amount ({business.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Fuel for delivery van, ECG Electricity prepaid units..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Paid Via
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                  >
                    <option value="CASH">Cash</option>
                    <option value="MOMO">Mobile Money</option>
                    <option value="CARD">Bank Card</option>
                  </select>
                </div>
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
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
