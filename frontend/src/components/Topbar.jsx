import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Sparkles,
  FolderPlus,
  LogOut,
  Settings,
  Globe,
  Menu,
  X,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useRealtimeNotifications } from '../context/RealtimeNotificationContext';

export default function Topbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const {
    unreadCount: projectUnreadCount,
    activeRole,
    setAppMode,
    logout,
    setIsSearchOpen,
    setIsCopilotOpen,
    setIsCreateTaskOpen,
    setEditingTask,
    setIsCreateProjectOpen,
    setIsNotificationDrawerOpen,
    setActiveView,
    isBackendConnected
  } = useProject();

  let realtimeUnreadCount = 0;
  let connectionStatus = 'OFFLINE';
  try {
    const realtime = useRealtimeNotifications();
    realtimeUnreadCount = realtime.unreadCount;
    connectionStatus = realtime.connectionStatus;
  } catch {}

  const effectiveUnreadCount = realtimeUnreadCount !== undefined ? realtimeUnreadCount : projectUnreadCount;


  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-[250px] z-10 px-4 sm:px-6 flex items-center justify-between surface-header text-[#F4F7FF]">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-1.5 rounded-lg border border-[#252A3A] text-[#8992A8] hover:bg-[#171A2A]"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="font-black text-lg tracking-tight flex items-center gap-1.5">
          INTELIX<span className="text-[#39D9FF]">.</span>
        </div>
      </div>

      {/* Global Search Bar (Ctrl+K) */}
      <div className="hidden md:flex items-center">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between gap-3 w-80 lg:w-96 bg-[#080A12] hover:bg-[#0D101A] border border-[#252A3A] hover:border-[#384158] rounded-xl px-3.5 py-1.5 text-xs text-[#8992A8] group transition shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#555E73] group-hover:text-[#39D9FF] transition" />
            <span className="text-[#8992A8]">Search tasks, projects, people...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-[#131522] border border-[#252A3A] text-[10px] font-mono text-[#8992A8]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
        {/* Live WebSocket/STOMP Connection Indicator */}
        <div
          title={
            connectionStatus === 'CONNECTED'
              ? 'Real-Time WebSocket/STOMP Stream: CONNECTED (Port 8080)'
              : (connectionStatus === 'RECONNECTING'
              ? 'WebSocket Stream Reconnecting...'
              : 'WebSocket Offline / Reconnecting...')
          }
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition ${
            connectionStatus === 'CONNECTED'
              ? 'bg-[#18C997]/10 text-[#18C997] border-[#18C997]/30'
              : (connectionStatus === 'RECONNECTING'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-[#555E73]/10 text-[#8992A8] border-[#252A3A]')
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition ${
              connectionStatus === 'CONNECTED'
                ? 'bg-[#18C997] animate-pulse shadow-[0_0_8px_#18C997]'
                : (connectionStatus === 'RECONNECTING'
                ? 'bg-amber-400 animate-ping'
                : 'bg-[#555E73]')
            }`}
          />
          <span>{connectionStatus === 'CONNECTED' ? 'STOMP: Live' : (connectionStatus === 'RECONNECTING' ? 'Reconnecting...' : 'STOMP: Offline')}</span>
        </div>


        {/* Role-Specific Primary Action */}
        {activeRole?.id === 'manager' && (
          <>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsCreateTaskOpen(true);
              }}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span className="hidden sm:inline">New Task</span>
            </button>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131522] hover:bg-[#171A2A] border border-[#252A3A] text-[#F4F7FF] text-xs font-semibold transition"
            >
              <FolderPlus size={14} className="text-[#8992A8]" />
              <span>New Initiative</span>
            </button>
          </>
        )}

        {activeRole?.id === 'dev' && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsCreateTaskOpen(true);
            }}
            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Create Task</span>
          </button>
        )}

        {activeRole?.id === 'client' && (
          <button
            onClick={() => setActiveView('Change Requests')}
            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Submit Change Request</span>
          </button>
        )}

        {activeRole?.id === 'exec' && (
          <button
            onClick={() => setActiveView('Approvals')}
            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
          >
            <CheckCircle2 size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Strategic Approvals</span>
          </button>
        )}

        {activeRole?.id === 'admin' && (
          <button
            onClick={() => setActiveView('Settings')}
            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition"
          >
            <Settings size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">System Config</span>
          </button>
        )}

        {/* Assistant Trigger */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#131522] hover:bg-[#171A2A] border border-[#252A3A] text-[#F4F7FF] text-xs font-semibold transition"
          title="Intelix Project Assistant (Ctrl+/)"
        >
          <Sparkles size={14} className="text-[#7C5CFF]" />
          <span className="hidden md:inline">Assistant</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative w-9 h-9 rounded-lg border border-[#252A3A] bg-[#131522] hover:bg-[#171A2A] grid place-items-center text-[#8992A8] hover:text-[#F4F7FF] transition"
          title="Notifications & System Activity"
        >
          <Bell size={15} className={effectiveUnreadCount > 0 ? "text-[#39D9FF]" : ""} />
          {effectiveUnreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF4D6D] text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-[0_0_8px_#FF4D6D] ring-2 ring-[#080A12] animate-pulse">
              {effectiveUnreadCount > 99 ? '99+' : effectiveUnreadCount}
            </span>
          )}
        </button>

        {/* Authenticated User Profile (LOCKED FOR SESSION) */}
        <div className="relative pl-2 border-l border-[#252A3A]" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#171A2A] transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7CFF] to-[#7C5CFF] text-white grid place-items-center text-xs font-bold font-mono shadow-sm">
              {activeRole.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-[#F4F7FF] leading-tight">
                {activeRole.name}
              </div>
              <div className="text-[10px] text-[#39D9FF] leading-tight font-medium">
                {activeRole.badge}
              </div>
            </div>
            <ChevronDown size={14} className="text-[#8992A8] hidden md:block" />
          </button>

          {/* Profile Menu Dropdown (NO ROLE SWITCHING) */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 surface-modal rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-[#252A3A]">
                <div className="text-xs font-bold text-[#F4F7FF] flex items-center gap-2">
                  <span>{activeRole.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D101A] border border-[#252A3A] text-[#39D9FF] font-mono">
                    {activeRole.badge}
                  </span>
                </div>
                <div className="text-[10px] text-[#8992A8] mt-1">{activeRole.roleTitle}</div>
                <div className="text-[9px] text-[#555E73] mt-0.5">{activeRole.permissions}</div>
              </div>

              <div className="py-1 space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    setActiveView('Settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522] transition"
                >
                  <User size={13} className="text-[#39D9FF]" />
                  <span>Profile ({activeRole.badge})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('Notifications');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522] transition"
                >
                  <Bell size={13} className="text-[#39D9FF]" />
                  <span>Notifications</span>
                  {effectiveUnreadCount > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF4D6D] text-white font-mono font-bold">
                      {effectiveUnreadCount}
                    </span>
                  )}
                </button>


                <button
                  onClick={() => {
                    setActiveView('Settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522] transition"
                >
                  <Settings size={13} className="text-[#8992A8]" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="pt-2 mt-1 border-t border-[#252A3A]">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[#FF859B] hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={13} />
                    <span>Logout</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#555E73]">Return to Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
