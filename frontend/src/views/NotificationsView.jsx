import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCheck,
  Clock
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function NotificationsView() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount
  } = useProject();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'danger' | 'warning' | 'info' | 'success'

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getSeverityBadge = (type) => {
    switch (type) {
      case 'danger':
        return <span className="badge-critical text-[10px] px-2 py-0.5 rounded font-mono font-bold">CRITICAL</span>;
      case 'warning':
        return <span className="badge-warning text-[10px] px-2 py-0.5 rounded font-mono font-bold">WARNING</span>;
      case 'success':
        return <span className="badge-success text-[10px] px-2 py-0.5 rounded font-mono font-bold">SUCCESS</span>;
      default:
        return <span className="badge-info text-[10px] px-2 py-0.5 rounded font-mono font-bold">INFO</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">ACTIVITY & TELEMETRY ALERTS</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            NOTIFICATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Prioritized delivery signals, dependency alerts, and client approval events."
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
          >
            <CheckCheck size={14} />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'danger', 'warning', 'info', 'success'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
              activeFilter === tab
                ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
                : 'bg-[#0D101A] border border-[#252A3A] text-[#8992A8] hover:text-[#F4F7FF]'
            }`}
          >
            {tab === 'danger' ? 'Critical' : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`surface-card rounded-2xl p-4 border transition cursor-pointer flex items-start justify-between gap-4 ${
              notif.unread
                ? 'border-[#4F7CFF]/40 bg-[#171A2A]'
                : 'border-[#252A3A] bg-[#131522]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getSeverityBadge(notif.type)}
                <span className="text-xs font-bold text-[#F4F7FF]">{notif.title}</span>
                {notif.unread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F7CFF]" />
                )}
              </div>
              <p className="text-xs text-[#8992A8]">{notif.message}</p>
            </div>

            <span className="text-[10px] font-mono text-[#555E73] shrink-0">{notif.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
