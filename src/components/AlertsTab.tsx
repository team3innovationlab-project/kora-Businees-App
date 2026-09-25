import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import { AlertNotification } from '../types';

interface AlertsTabProps {
  alerts: AlertNotification[];
  onResolveAlert: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  onResolveAlert,
  onNavigateTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Operational & Inventory Alerts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time warnings for low stock levels, reconciliation discrepancies, and critical cashier events.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
          {alerts.length} Active {alerts.length === 1 ? 'Alert' : 'Alerts'}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">All clear!</h3>
            <p className="text-xs text-slate-500">
              No active warnings or unaddressed discrepancies at this time.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                alert.severity === 'critical'
                  ? 'bg-red-50/70 border-red-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-600'
                      : alert.severity === 'warning'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Triggered on {alert.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {alert.actionPath && (
                  <button
                    onClick={() => onNavigateTab(alert.actionPath)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                  >
                    View in {alert.actionPath}
                  </button>
                )}
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
