import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Receipt, 
  BadgePercent, 
  PlusCircle, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  PackageCheck,
  ChevronRight,
  Boxes,
  Download,
  RefreshCw
} from 'lucide-react';
import { BusinessProfile, DashboardMetrics, User, Sale } from '../types';
import { exportToCsv } from '../utils/exportCsv';

interface DashboardOverviewProps {
  business: BusinessProfile;
  metrics: DashboardMetrics;
  currentUser: User | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenRecordSale: () => void;
  onOpenWhatsAppReport: () => void;
  onNavigateTab: (tab: 'sales' | 'expenses' | 'stock' | 'reconciliation') => void;
  onShowToast?: (msg: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  business,
  metrics,
  currentUser,
  selectedDate,
  onDateChange,
  onOpenRecordSale,
  onOpenWhatsAppReport,
  onNavigateTab,
  onShowToast,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const isBalanced = metrics.reconciliation.status === 'Balanced';

  const handleExportSalesCsv = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/sales?date=${selectedDate}`);
      if (!res.ok) throw new Error('Failed to fetch sales');
      const sales: Sale[] = await res.json();

      if (sales.length === 0) {
        if (onShowToast) onShowToast(`No sales recorded on ${selectedDate} to export.`);
        return;
      }

      const headers = [
        'Receipt Number',
        'Date',
        'Time',
        'Cashier',
        'Customer Name',
        'Customer Phone',
        'Payment Method',
        'Items Summary',
        'Total Amount (GHS)',
      ];

      const rows = sales.map((s) => [
        s.receiptNumber,
        s.date,
        s.time,
        s.cashierName,
        s.customerName || 'Walk-in Customer',
        s.customerPhone || 'N/A',
        s.paymentMethod,
        s.items.map((i) => `${i.name} (x${i.quantity})`).join('; '),
        s.totalAmount.toFixed(2),
      ]);

      const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_sales_${selectedDate}`;
      exportToCsv(filename, headers, rows);
      if (onShowToast) onShowToast(`Exported ${sales.length} sales transactions to CSV!`);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Failed to export sales to CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner Card (matching screenshot) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Owner Performance Dashboard
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Store className="w-3.5 h-3.5" />
              <span>{business.name}</span>
              <span className="text-emerald-400">·</span>
              <span>{business.category}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time business visibility across sales, cash flow, expenses, and staff performance for {currentUser?.name || 'George J'}.
          </p>
        </div>

        {/* Date Selector and Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Picker Input */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold text-slate-800 cursor-pointer"
            />
          </div>

          {/* Export Sales CSV Button */}
          <button
            onClick={handleExportSalesCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Export today's sales transactions to CSV for accounting"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span>Export Sales CSV</span>
          </button>

          {/* Record Sale Button (Green) */}
          <button
            onClick={onOpenRecordSale}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Sale</span>
          </button>

          {/* WhatsApp Summary Button (Dark teal) */}
          <button
            onClick={onOpenWhatsAppReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0d222b] hover:bg-[#153442] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Summary</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. TODAY'S SALES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Today's Sales
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {business.currency} {metrics.todaySales.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total sales for selected day
            </p>
          </div>
        </div>

        {/* 2. TRANSACTIONS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Transactions
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {metrics.transactionCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total completed customer orders
            </p>
          </div>
        </div>

        {/* 3. TODAY'S EXPENSES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Today's Expenses
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-red-600 tracking-tight font-sans">
              {business.currency} {metrics.todayExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Operational cash outflows
            </p>
          </div>
        </div>

        {/* 4. ESTIMATED PROFIT (Solid Dark Green Card) */}
        <div className="bg-[#053728] text-white rounded-2xl p-5 border border-emerald-950/40 shadow-md relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Estimated Profit
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-800/60 text-emerald-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">
              {business.currency} {metrics.estimatedProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              Sales ({metrics.todaySales}) - Expenses ({metrics.todayExpenses})
            </p>
          </div>
        </div>
      </div>

      {/* Second Row: Daily Reconciliation Status & Stock Restock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Reconciliation Status (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Daily Reconciliation Status
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isBalanced
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {isBalanced ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>
                  {isBalanced
                    ? `Balanced (${business.currency} 0)`
                    : `Discrepancy (${business.currency} ${Math.abs(metrics.reconciliation.variance)})`}
                </span>
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              Formula: Expected - Actual
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Compare registered sales against actual counted cash, Mobile Money, and card settlements to prevent leakage.
          </p>

          {/* Reconciliation 3-column breakdown box */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 grid grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">
                Expected Revenue
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block font-sans">
                {business.currency} {metrics.reconciliation.expectedRevenue.toFixed(0)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">
                Counted Actual
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block font-sans">
                {business.currency} {metrics.reconciliation.countedActual.toFixed(0)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">
                Variance
              </span>
              <span
                className={`text-base font-bold mt-0.5 block font-sans ${
                  isBalanced
                    ? 'text-emerald-600'
                    : metrics.reconciliation.variance < 0
                    ? 'text-red-600'
                    : 'text-amber-600'
                }`}
              >
                {business.currency} {metrics.reconciliation.variance.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => onNavigateTab('reconciliation')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Perform End-of-Day Reconciliation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stock Restock Alerts (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Stock Restock Alerts
              </h2>
            </div>

            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {metrics.lowStockCount} Low
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Items at or below restock threshold (Current Quantity ≤ Restock Level):
          </p>

          {/* Status Box */}
          {metrics.lowStockCount === 0 ? (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 text-center">
              <PackageCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-emerald-800">
                All tracked stock items are adequately stocked.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {metrics.lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-amber-800">
                      Remaining: {item.currentQuantity} {item.unit} (Alert at {item.restockThreshold})
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('stock')}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px]"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => onNavigateTab('stock')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Manage Full Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
