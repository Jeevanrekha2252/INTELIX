import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCheck,
  Clock,
  ExternalLink,
  Sliders,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  ClipboardList,
  ShieldAlert,
  FolderGit2
} from 'lucide-react';
import { useRealtimeNotifications } from '../context/RealtimeNotificationContext';
import { useProject } from '../context/ProjectContext';

export default function NotificationsView() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    connectionStatus,
    preferences,
    updatePreferences
  } = useRealtimeNotifications();

  const { setActiveView } = useProject();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Unread' | 'Tasks' | 'Risks' | 'Approvals' | 'Meetings' | 'Project Updates'
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [showPreferences, setShowPreferences] = useState(false);

  // Filter notifications based on tab
  const filtered = notifications.filter(n => {
    if (activeTab === 'Unread') return n.unread || !n.isRead;
    if (activeTab === 'Tasks') {
      const t = n.type || n.category || '';
      return t.includes('TASK') || t.includes('BLOCKER') || n.relatedEntityType === 'TASK';
    }
    if (activeTab === 'Risks') {
      const t = n.type || n.category || '';
      return t.includes('RISK') || t.includes('DEPENDENCY') || t.includes('CRITICAL');
    }
    if (activeTab === 'Approvals') {
      const t = n.type || n.category || '';
      return t.includes('APPROVAL') || t.includes('DELIVERABLE') || t.includes('CHANGE_REQUEST') || n.relatedEntityType === 'APPROVAL';
    }
    if (activeTab === 'Meetings') {
      const t = n.type || n.category || '';
      return t.includes('MEETING') || n.relatedEntityType === 'MEETING';
    }
    if (activeTab === 'Project Updates') {
      const t = n.type || n.category || '';
      return t.includes('PROJECT') || t.includes('MILESTONE');
    }
    return true; // 'All'
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedNotifications = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const getSeverityBadge = (severity, type) => {
    const s = severity || type || 'INFO';
    if (s === 'CRITICAL' || s === 'HIGH' || s === 'danger') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          <AlertOctagon size={11} />
          CRITICAL
        </span>
      );
    }
    if (s === 'WARNING' || s === 'MEDIUM' || s === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          <AlertTriangle size={11} />
          WARNING
        </span>
      );
    }
    if (s === 'SUCCESS' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          <CheckCircle2 size={11} />
          SUCCESS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
        <Info size={11} />
        INFO
      </span>
    );
  };

  const getCategoryIcon = (n) => {
    const t = n.type || n.category || '';
    if (t.includes('BLOCKER') || t.includes('CRITICAL')) return <AlertOctagon size={16} className="text-rose-400" />;
    if (t.includes('RISK') || t.includes('DEPENDENCY')) return <ShieldAlert size={16} className="text-amber-400" />;
    if (t.includes('MEETING')) return <Calendar size={16} className="text-cyan-400" />;
    if (t.includes('APPROVAL') || t.includes('CHANGE_REQUEST')) return <CheckCircle2 size={16} className="text-purple-400" />;
    if (t.includes('TASK')) return <ClipboardList size={16} className="text-blue-400" />;
    return <Bell size={16} className="text-slate-400" />;
  };

  const handleOpenRelated = (n) => {
    if (n.relatedEntityType === 'TASK') setActiveView('Tasks');
    else if (n.relatedEntityType === 'CHANGE_REQUEST') setActiveView('Change Requests');
    else if (n.relatedEntityType === 'APPROVAL') setActiveView('Approvals');
    else if (n.relatedEntityType === 'MEETING') setActiveView('Meetings');
    else if (n.relatedEntityType === 'PROJECT') setActiveView('Overview');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#252A3A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-tech text-[#39D9FF]">REAL-TIME TELEMETRY STREAM</span>
            {/* Live Connection Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : connectionStatus === 'RECONNECTING'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'CONNECTED' ? 'bg-emerald-400' : (connectionStatus === 'RECONNECTING' ? 'bg-amber-400' : 'bg-rose-400')
              }`} />
              {connectionStatus === 'CONNECTED' ? 'STOMP LIVE' : connectionStatus}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-1 flex items-center gap-3">
            <span>NOTIFICATION CENTER</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF4D6D] text-white font-mono font-bold">
                {unreadCount} UNREAD
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            Zero-refresh real-time event pipeline delivering task assignments, blockers, risk spikes, and client approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPreferences(prev => !prev)}
            className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#131522] border border-[#252A3A] hover:bg-[#171A2A]"
            title="Notification Preferences"
          >
            <Sliders size={14} className="text-[#39D9FF]" />
            <span>Preferences</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Preferences Panel Modal/Drawer */}
      {showPreferences && (
        <div className="surface-card rounded-2xl p-5 border border-[#384158] bg-[#0E121E] shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#39D9FF]" />
              <span className="text-sm font-bold text-[#F4F7FF]">Notification Preferences</span>
            </div>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-xs text-[#8992A8] hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs">
            {[
              { key: 'tasksEnabled', label: 'Tasks & Blockers' },
              { key: 'risksEnabled', label: 'Risk Thresholds' },
              { key: 'projectsEnabled', label: 'Project Health' },
              { key: 'meetingsEnabled', label: 'Meetings' },
              { key: 'approvalsEnabled', label: 'Approvals & CRs' },
              { key: 'soundEnabled', label: 'Audio Chimes', icon: preferences.soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} /> }
            ].map(item => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#131522] border border-[#252A3A] cursor-pointer hover:border-[#384158] transition"
              >
                <span className="font-semibold text-[#D3D9E6] flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
                <input
                  type="checkbox"
                  checked={!!preferences[item.key]}
                  onChange={e => updatePreferences({ ...preferences, [item.key]: e.target.checked })}
                  className="rounded border-[#384158] bg-[#080A12] text-[#4F7CFF] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            ))}
          </div>
          <p className="text-[11px] text-[#555E73] mt-3">
            * Critical project blockers and security escalation alerts bypass muting rules to ensure operational safety.
          </p>
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#252A3A] pb-3">
        {['All', 'Unread', 'Tasks', 'Risks', 'Approvals', 'Meetings', 'Project Updates'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === tab
                ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35 shadow-sm'
                : 'bg-[#0D101A] border border-[#252A3A] text-[#8992A8] hover:text-[#F4F7FF]'
            }`}
          >
            <span>{tab}</span>
            {tab === 'Unread' && unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FF4D6D] text-white text-[10px] font-mono">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {pagedNotifications.length === 0 ? (
          <div className="p-12 text-center surface-card rounded-2xl border border-[#252A3A]">
            <Bell size={28} className="mx-auto text-[#555E73] mb-2" />
            <p className="text-sm font-semibold text-[#8992A8]">No notifications in this category.</p>
            <p className="text-xs text-[#555E73] mt-1">Real-time alerts will appear automatically as events occur.</p>
          </div>
        ) : (
          pagedNotifications.map(notif => {
            const isUnread = notif.unread || !notif.isRead;
            return (
              <div
                key={notif.id}
                className={`surface-card rounded-2xl p-4 border transition flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  isUnread
                    ? 'border-[#4F7CFF]/45 bg-[#121626] shadow-lg shadow-black/30'
                    : 'border-[#252A3A] bg-[#0E111C]/80 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#171B2B] border border-[#252A3A] grid place-items-center shrink-0 mt-0.5">
                    {getCategoryIcon(notif)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(notif.severity, notif.type)}
                      <span className="text-xs font-bold text-[#F4F7FF] tracking-tight">
                        {notif.title}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#4F7CFF] shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-[#8992A8] leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#555E73] pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={12} />
                        {notif.time || 'Just now'}
                      </span>
                      {notif.relatedEntityType && (
                        <span className="px-1.5 py-0.2 rounded bg-[#171B2B] border border-[#252A3A] font-mono text-[10px] text-[#8992A8]">
                          {notif.relatedEntityType}: {notif.relatedEntityId || notif.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.relatedEntityType && (
                    <button
                      onClick={() => handleOpenRelated(notif)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#171B2B] hover:bg-[#1E2338] border border-[#252A3A] text-[#39D9FF] flex items-center gap-1 transition"
                    >
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </button>
                  )}

                  {isUnread && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#8992A8] hover:text-white hover:bg-[#171B2B] transition"
                      title="Mark as read"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[#252A3A] text-xs text-[#8992A8]">
          <span>
            Page {page + 1} of {totalPages} ({filtered.length} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-[#252A3A] bg-[#131522] hover:bg-[#171A2A] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-[#252A3A] bg-[#131522] hover:bg-[#171A2A] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
