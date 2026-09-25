import React from 'react';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  ReceiptText, 
  Boxes, 
  Scale, 
  Users, 
  Bell,
  Megaphone
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'sales' 
  | 'expenses' 
  | 'stock' 
  | 'reconciliation' 
  | 'customers'
  | 'staff' 
  | 'alerts';

interface NavigationProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  alertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  alertsCount,
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'sales' as ActiveTab, label: 'Sales & Register', icon: CircleDollarSign },
    { id: 'expenses' as ActiveTab, label: 'Expenses', icon: ReceiptText },
    { id: 'stock' as ActiveTab, label: 'Stock', icon: Boxes },
    { id: 'reconciliation' as ActiveTab, label: 'Reconciliation', icon: Scale },
    { id: 'customers' as ActiveTab, label: 'Customers & Promos', icon: Megaphone },
    { id: 'staff' as ActiveTab, label: 'Staff', icon: Users },
    { id: 'alerts' as ActiveTab, label: 'Alerts', icon: Bell, badge: alertsCount },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0f242e] text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
