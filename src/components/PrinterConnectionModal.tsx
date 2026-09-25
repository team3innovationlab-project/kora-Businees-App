import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Bluetooth, 
  Wifi, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Settings2, 
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BusinessProfile, Sale, DailyReconciliation, PrinterConfig } from '../types';
import { printerManager } from '../utils/printerService';

interface PrinterConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  sales?: Sale[];
  selectedDate?: string;
  reconciliation?: DailyReconciliation | null;
  onShowToast: (msg: string) => void;
}

export const PrinterConnectionModal: React.FC<PrinterConnectionModalProps> = ({
  isOpen,
  onClose,
  business,
  sales = [],
  selectedDate = new Date().toISOString().split('T')[0],
  reconciliation = null,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'bluetooth' | 'wifi' | 'preview'>('bluetooth');
  const [config, setConfig] = useState<PrinterConfig>(printerManager.getConfig());
  const [isScanning, setIsScanning] = useState(false);
  const [wifiIp, setWifiIp] = useState(config.ipAddress || '192.168.1.180');
  const [wifiPort, setWifiPort] = useState(config.port || 9100);
  const [isConnectingWifi, setIsConnectingWifi] = useState(false);

  useEffect(() => {
    setConfig(printerManager.getConfig());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectBluetooth = async () => {
    setIsScanning(true);
    try {
      const res = await printerManager.connectBluetooth();
      setConfig(printerManager.getConfig());
      onShowToast(res.message);
    } catch (err: any) {
      onShowToast(err.message || 'Bluetooth connection failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnectWifi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnectingWifi(true);
    try {
      const res = await printerManager.connectWifi(wifiIp, Number(wifiPort));
      setConfig(printerManager.getConfig());
      onShowToast(res.message);
    } catch (err: any) {
      onShowToast('Could not reach Wi-Fi printer.');
    } finally {
      setIsConnectingWifi(false);
    }
  };

  const handleTogglePaperWidth = (width: '58mm' | '80mm') => {
    printerManager.updateConfig({ paperWidth: width });
    setConfig(printerManager.getConfig());
    onShowToast(`Paper roll width set to ${width}`);
  };

  const handlePrintAccountingSlip = () => {
    const slip = printerManager.formatAccountingSalesSlip(business, sales, selectedDate, reconciliation);
    printerManager.printToThermalWindow(slip, `${business.name} Accounting Slip`);
    onShowToast('Dispatched accounting sales record to thermal printer!');
  };

  const handlePrintTestSlip = () => {
    const testContent = `
================================
     ${business.name.toUpperCase()}
   THERMAL PRINTER TEST SLIP
================================
Terminal: ${config.deviceName || 'POS-58'}
Type:     ${config.connectionType}
Roll:     ${config.paperWidth}
Status:   ONLINE & READY
Date:     ${selectedDate}
Time:     ${new Date().toLocaleTimeString()}
--------------------------------
1234567890 ABCDEFGHIJKLMNOPQRST
TEST COMPLETE - FEED OK
================================
KORA RETAIL OPERATING SYSTEM
pos.kora.app
    `.trim();

    printerManager.printToThermalWindow(testContent, 'Printer Test Slip');
    onShowToast('Test print job sent to printer!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight flex items-center gap-2">
                <span>Receipt Printer (BT / Wi-Fi)</span>
                {config.isConnected ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ONLINE</span>
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    DISCONNECTED
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Connect Bluetooth or Wi-Fi ESC/POS thermal printer for accounting records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 pb-2 flex gap-1.5 border-b border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bluetooth')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'bluetooth'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
            <span>Bluetooth Printer</span>
          </button>

          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'wifi'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wi-Fi / LAN IP</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Accounting Slip</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Paper Size selector */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Thermal Paper Width</span>
              <span className="text-[11px] text-slate-500">Standard portable POS rolls</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleTogglePaperWidth('58mm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  config.paperWidth === '58mm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                58mm (2-inch)
              </button>
              <button
                type="button"
                onClick={() => handleTogglePaperWidth('80mm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  config.paperWidth === '80mm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                80mm (3-inch)
              </button>
            </div>
          </div>

          {/* BLUETOOTH TAB */}
          {activeTab === 'bluetooth' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Bluetooth ESC/POS Device
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {config.connectionType === 'BLUETOOTH' && config.isConnected
                          ? config.deviceName || 'Connected'
                          : 'No device paired'}
                      </span>
                    </div>
                  </div>

                  {config.connectionType === 'BLUETOOTH' && config.isConnected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </div>

                <div className="text-xs text-slate-600 leading-relaxed">
                  Turn on your mobile Bluetooth receipt printer (e.g. MPT-II, POS-5802, Epson TM-T20II, or Xprinter) and click the button below to scan and pair.
                </div>

                <button
                  type="button"
                  onClick={handleConnectBluetooth}
                  disabled={isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning for Bluetooth Printers...' : 'Scan & Connect Bluetooth Printer'}</span>
                </button>
              </div>

              {config.connectionType === 'BLUETOOTH' && config.isConnected && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-900">{config.deviceName} is ready</span>
                  </div>
                  <button
                    onClick={() => {
                      printerManager.disconnect();
                      setConfig(printerManager.getConfig());
                      onShowToast('Bluetooth printer disconnected.');
                    }}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WIFI / NETWORK TAB */}
          {activeTab === 'wifi' && (
            <form onSubmit={handleConnectWifi} className="space-y-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Wi-Fi / LAN Network Receipt Printer
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard Raw Port 9100 / ESC-POS Socket
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Printer IP Address
                    </label>
                    <input
                      type="text"
                      required
                      value={wifiIp}
                      onChange={(e) => setWifiIp(e.target.value)}
                      placeholder="192.168.1.180"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Port
                    </label>
                    <input
                      type="number"
                      required
                      value={wifiPort}
                      onChange={(e) => setWifiPort(Number(e.target.value))}
                      placeholder="9100"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-mono text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isConnectingWifi}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>{isConnectingWifi ? 'Connecting...' : 'Connect to Network Printer'}</span>
                </button>
              </div>

              {config.connectionType === 'WIFI' && config.isConnected && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-900">
                      Connected to {config.ipAddress}:{config.port}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      printerManager.disconnect();
                      setConfig(printerManager.getConfig());
                      onShowToast('Wi-Fi printer disconnected.');
                    }}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </form>
          )}

          {/* PREVIEW & ACCOUNTING RECORD TAB */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Accounting Sales Slip ({sales.length} orders on {selectedDate})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {config.paperWidth} Roll Format
                </span>
              </div>

              <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl max-h-56 overflow-y-auto border border-slate-800 shadow-inner whitespace-pre-wrap leading-tight">
                {printerManager.formatAccountingSalesSlip(business, sales, selectedDate, reconciliation)}
              </div>
            </div>
          )}

          {/* Actions & Test Printing */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrintTestSlip}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Print Test Slip
            </button>

            <button
              type="button"
              onClick={handlePrintAccountingSlip}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Accounting Sales Slip</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>Thermal ESC/POS Compatible (58mm/80mm)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
