import React from 'react'
import type { PageRoute } from '../types'

interface SidebarProps {
  currentRoute: PageRoute
  onNavigate: (route: PageRoute) => void
}

const navItems: { route: PageRoute; label: string; icon: string; badge?: string }[] = [
  { route: 'waste-scanner', label: 'Waste Scanner', icon: 'qr_code_scanner' },
  { route: 'dashboard', label: 'Dashboard & Metrics', icon: 'grid_view' },
  { route: 'scan-history', label: 'Scan History', icon: 'receipt_long' },
  { route: 'waste-guide', label: 'Waste Guide', icon: 'menu_book' },
  { route: 'about-project', label: 'About Project', icon: 'science' }
]

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-container-low flex flex-col justify-between py-space-lg px-space-md z-40 select-none shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/20">
      <div className="flex flex-col gap-space-lg">
        {/* Brand Header (Clean typography, no logo, no AI word) */}
        <div
          className="flex flex-col px-space-sm cursor-pointer"
          onClick={() => onNavigate('waste-scanner')}
        >
          <span className="font-headline-sm text-2xl text-primary font-bold tracking-tight">
            EcoSort
          </span>
          <span className="font-body-sm text-[11px] text-on-surface-variant font-medium mt-0.5">
            Waste Segregation System
          </span>
        </div>

        {/* Global Navigation Rail */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`w-full text-left flex items-center justify-between px-space-md py-2.5 rounded-xl transition-colors font-label-lg text-sm cursor-pointer ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-semibold relative before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-full"
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-code-sm font-bold bg-primary text-on-primary">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Institutional Ecological Impact Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(32,40,32,0.04)] flex flex-col gap-space-xs border border-outline-variant/30">
        <div className="flex items-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-[16px]">eco</span>
          <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">
            Impact Note
          </span>
        </div>
        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
          Every correct disposal counts. Model running locally via TensorFlow.js.
        </p>
      </div>
    </aside>
  )
}
