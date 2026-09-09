import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Sparkles,
  Activity,
  CheckCheck
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function NotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    activity,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount
  } = useProject();

  const [activeTab, setActiveTab] = useState('notifications');

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full surface-modal border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
              <Bell size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Notifications & Activity
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">Live project event stream</div>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={17} />
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-4 pt-2.5 pb-2 flex gap-2 border-b border-slate-800 bg-[#080c14]">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Bell size={13} />
            <span>Alerts ({notifications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'activity'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Activity size={13} />
            <span>Audit Log ({activity.length})</span>
          </button>
        </div>

        {activeTab === 'notifications' && unreadCount > 0 && (
          <div className="px-4 py-2 flex justify-end border-b border-slate-800/80 bg-slate-950">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <CheckCheck size={13} />
              Mark all as read
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {activeTab === 'notifications' ? (
            notifications.map(notif => {
              const isDanger = notif.type === 'danger';
              const isAi = notif.type === 'ai';
              const isSuccess = notif.type === 'success';

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    notif.unread
                      ? 'bg-slate-900 border-blue-500/40'
                      : 'bg-slate-950/60 border-slate-800/70 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-md grid place-items-center shrink-0 mt-0.5 ${
                        isDanger
                          ? 'bg-rose-500/20 text-rose-400'
                          : isAi
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {isDanger ? <AlertOctagon size={14} /> : isAi ? <Sparkles size={14} /> : isSuccess ? <CheckCircle2 size={14} /> : <Info size={14} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>

                    {notif.unread && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            activity.map(act => (
              <div key={act.id} className="flex gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    act.type === 'risk'
                      ? 'bg-rose-400'
                      : act.type === 'done'
                      ? 'bg-emerald-400'
                      : 'bg-blue-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200">{act.text}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>{act.user}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
