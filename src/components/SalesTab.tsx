import React, { useState, useEffect } from 'react';
import { 
  CircleDollarSign, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Smartphone, 
  Banknote, 
  CreditCard, 
  Layers, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingBag,
  Clock,
  User as UserIcon,
  CheckCircle2,
  Printer,
  Lock,
  Unlock,
  Key,
  Wifi,
  Bluetooth
} from 'lucide-react';
import { Sale, BusinessProfile, PaymentMethod, User } from '../types';
import { exportToCsv } from '../utils/exportCsv';
import { printerManager } from '../utils/printerService';
import { PinAuthModal } from './PinAuthModal';

interface SalesTabProps {
  business: BusinessProfile;
  selectedDate: string;
  currentUser?: User | null;
  isPinUnlocked?: boolean;
  onUnlockPin?: () => void;
  onLockTerminal?: () => void;
  onOpenRecordSale: () => void;
  onOpenPrinterModal?: () => void;
  onShowToast: (msg: string) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
  business,
  selectedDate,
  currentUser = null,
  isPinUnlocked = false,
  onUnlockPin,
  onLockTerminal,
  onOpenRecordSale,
  onOpenPrinterModal,
  onShowToast,
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'SELECTED_DATE' | 'ALL_TIME'>('SELECTED_DATE');
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const isStaff = currentUser?.role === 'CASHIER' || currentUser?.role === 'STAFF';

  useEffect(() => {
    fetchSales();
  }, [selectedDate, dateFilter, business.id]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const url = dateFilter === 'SELECTED_DATE' ? `/api/sales?date=${selectedDate}` : '/api/sales';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      onShowToast('Failed to load sales transactions.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((s) => {
    const matchSearch =
      s.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (s.customerPhone && s.customerPhone.includes(search)) ||
      (s.cashierName && s.cashierName.toLowerCase().includes(search.toLowerCase())) ||
      s.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchMethod = methodFilter === 'All' || s.paymentMethod === methodFilter;
    return matchSearch && matchMethod;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalItemsSold = filteredSales.reduce(
    (acc, s) => acc + s.items.reduce((itemSum, i) => itemSum + i.quantity, 0),
    0
  );

  // Export current view's sales table to CSV for accounting
  const handleExportCsv = () => {
    if (filteredSales.length === 0) {
      onShowToast('No sales transactions to export in the current view.');
      return;
    }

    const headers = [
      'Receipt Number',
      'Date',
      'Time',
      'Cashier Name',
      'Customer Name',
      'Customer Phone',
      'Payment Method',
      'MoMo Network / Ref',
      'Items Count',
      'Itemized Products (Qty @ Price)',
      'Subtotal (GHS)',
      'Discount (GHS)',
      'Tax (GHS)',
      'Total Paid (GHS)',
    ];

    const rows = filteredSales.map((s) => {
      const itemsDetail = s.items
        .map((i) => `${i.name} (x${i.quantity} @ GH₵ ${i.unitPrice.toFixed(2)})`)
        .join('; ');

      const momoDetail = s.paymentMethod === 'MOMO' 
        ? `${s.momoNetwork || 'MoMo'} - Ref: ${s.momoReference || 'N/A'}`
        : 'N/A';

      const itemsQty = s.items.reduce((sum, item) => sum + item.quantity, 0);

      return [
        s.receiptNumber,
        s.date,
        s.time,
        s.cashierName,
        s.customerName || 'Walk-in Customer',
        s.customerPhone || 'N/A',
        s.paymentMethod,
        momoDetail,
        itemsQty,
        itemsDetail,
        s.subtotal.toFixed(2),
        (s.discount || 0).toFixed(2),
        (s.tax || 0).toFixed(2),
        s.totalAmount.toFixed(2),
      ];
    });

    const dateSlug = dateFilter === 'SELECTED_DATE' ? selectedDate : 'all_dates';
    const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_sales_accounting_${dateSlug}`;
    exportToCsv(filename, headers, rows);
    onShowToast(`Exported ${filteredSales.length} sales records to CSV!`);
  };

  const renderPaymentBadge = (method: PaymentMethod, momoNetwork?: string) => {
    switch (method) {
      case 'MOMO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Smartphone className="w-3 h-3 text-amber-600" />
            <span>MoMo ({momoNetwork || 'MTN'})</span>
          </span>
        );
      case 'CARD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <CreditCard className="w-3 h-3 text-blue-600" />
            <span>Card Settlement</span>
          </span>
        );
      case 'CASH':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Banknote className="w-3 h-3 text-emerald-600" />
            <span>Cash</span>
          </span>
        );
    }
  };

  const handlePrintAccountingSalesRecord = () => {
    if (filteredSales.length === 0) {
      onShowToast('No sales records to print for this selection.');
      return;
    }
    const slip = printerManager.formatAccountingSalesSlip(business, filteredSales, selectedDate);
    printerManager.printToThermalWindow(slip, `${business.name} Sales Accounting Record`);
    onShowToast('Dispatched sales record to thermal receipt printer!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Staff PIN Lock Status Bar (Role-Based Access) */}
      {isStaff && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-all ${
          isPinUnlocked 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              isPinUnlocked ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {isPinUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-extrabold block text-sm">
                {isPinUnlocked 
                  ? `Sales Terminal Unlocked for ${currentUser?.name || 'Staff'}` 
                  : 'Sales Register Locked — PIN Authentication Required'}
              </span>
              <span className="text-[11px] opacity-80">
                {isPinUnlocked
                  ? `Staff role: ${currentUser?.role?.replace('_', ' ')} · Ready to record sales`
                  : 'Cashier members must enter their 4-digit PIN to access register & record transactions'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPinUnlocked ? (
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Enter Cashier PIN (9012)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLockTerminal}
                className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Terminal</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Banner & KPI summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Sales Transactions & Register Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {business.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit itemized receipts, cashier registers, customer phone logs, and export or print sales records for business accounting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Connect BT/WiFi Printer Button */}
          {onOpenPrinterModal && (
            <button
              onClick={onOpenPrinterModal}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              title="Connect Bluetooth or Wi-Fi ESC/POS thermal receipt printer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>BT / Wi-Fi Printer</span>
            </button>
          )}

          {/* Print Accounting Sales Record Slip Button */}
          <button
            onClick={handlePrintAccountingSalesRecord}
            disabled={filteredSales.length === 0}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Print thermal accounting sales record slip directly to connected BT/Wi-Fi printer"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            <span>Print Accounting Record</span>
          </button>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={filteredSales.length === 0}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Download formatted CSV spreadsheet of sales transactions for accounting"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Record New Sale Action */}
          <button
            onClick={() => {
              if (isStaff && !isPinUnlocked) {
                setShowPinModal(true);
              } else {
                onOpenRecordSale();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Sale</span>
          </button>
        </div>
      </div>

      {/* Cashier PIN Unlock Modal */}
      <PinAuthModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        user={currentUser}
        targetActionName="Sales Register Access"
        onSuccess={() => {
          if (onUnlockPin) onUnlockPin();
          setShowPinModal(false);
          onShowToast(`Cashier ${currentUser?.name || ''} authenticated via PIN!`);
        }}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Filtered Total Revenue
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {business.currency} {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            From {filteredSales.length} transaction{filteredSales.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Products Sold
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              {totalItemsSold}
            </span>
            <span className="text-xs text-slate-500 font-medium">units</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across registered inventory items
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Ticket Size
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {business.currency} {filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(2) : '0.00'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Per customer checkout
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search receipt #, customer, phone, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
          {/* Date Filter Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setDateFilter('SELECTED_DATE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === 'SELECTED_DATE'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              📅 {selectedDate}
            </button>
            <button
              onClick={() => setDateFilter('ALL_TIME')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === 'ALL_TIME'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Time History
            </button>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Payment Methods</option>
              <option value="CASH">Cash Only</option>
              <option value="MOMO">Mobile Money (MoMo)</option>
              <option value="CARD">Card Payments</option>
            </select>
          </div>

          <button
            onClick={fetchSales}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh Sales"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Sales Records ({filteredSales.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any row to inspect line-item breakdown
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">Loading sales transactions...</span>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No sales transactions found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No sales recorded for this filter. Record a transaction with the POS register to see it logged here.
            </p>
            <button
              onClick={onOpenRecordSale}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Sale</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((s) => {
                  const isExpanded = expandedSaleId === s.id;
                  const totalItems = s.items.reduce((sum, i) => sum + i.quantity, 0);

                  return (
                    <React.Fragment key={s.id}>
                      <tr
                        onClick={() => setExpandedSaleId(isExpanded ? null : s.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        {/* Receipt */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {s.receiptNumber}
                        </td>

                        {/* Date & Time */}
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{s.date}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{s.time}</div>
                        </td>

                        {/* Customer & Phone */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {s.customerName || 'Walk-in Customer'}
                          </div>
                          {s.customerPhone ? (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                              <span>{s.customerPhone}</span>
                              <a
                                href={`https://wa.me/${s.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-emerald-600 hover:text-emerald-800"
                                title="Chat on WhatsApp"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No phone logged</span>
                          )}
                        </td>

                        {/* Items */}
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-bold text-slate-800">{totalItems} items</span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                            {s.items.map((i) => i.name).join(', ')}
                          </span>
                        </td>

                        {/* Cashier */}
                        <td className="py-3 px-4 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3 h-3 text-slate-400" />
                            <span>{s.cashierName}</span>
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-4">
                          {renderPaymentBadge(s.paymentMethod, s.momoNetwork)}
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                          {business.currency} {s.totalAmount.toFixed(2)}
                        </td>

                        {/* Expand toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Itemized Breakdown */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200/80">
                          <td colSpan={8} className="p-4 sm:px-8">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Itemized Receipt Breakdown ({s.receiptNumber})</span>
                                </span>

                                <div className="text-[11px] text-slate-500">
                                  Payment:{' '}
                                  <strong className="text-slate-800">
                                    {s.paymentMethod}
                                    {s.momoReference ? ` (Ref: ${s.momoReference})` : ''}
                                  </strong>
                                </div>
                              </div>

                              <div className="divide-y divide-slate-100 text-xs">
                                {s.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="py-2 flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="font-bold text-slate-900 block">
                                        {item.name}
                                      </span>
                                      <span className="text-[11px] text-slate-400">
                                        Unit Price: {business.currency} {item.unitPrice.toFixed(2)}
                                      </span>
                                    </div>

                                    <div className="text-right">
                                      <span className="font-mono text-slate-600 text-[11px] mr-4">
                                        x{item.quantity}
                                      </span>
                                      <span className="font-bold text-slate-900">
                                        {business.currency} {item.total.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700">Total Charged:</span>
                                <span className="text-emerald-700 text-sm">
                                  {business.currency} {s.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
