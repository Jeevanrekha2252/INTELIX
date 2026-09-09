import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  GitMerge,
  ShieldAlert,
  BarChart2,
  Users2,
  FileCheck2,
  GitPullRequest,
  CheckCircle2,
  Video,
  FileText,
  Bell,
  Settings,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export function getRoleNavGroups(roleId, badges = {}) {
  switch (roleId) {
    case 'dev':
      return [
        {
          title: 'MY WORKSPACE',
          items: [
            { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Projects', label: 'My Projects', icon: FolderKanban, badge: badges.projects },
            { id: 'Tasks', label: 'My Tasks', icon: CheckSquare, badge: badges.myTasks },
            { id: 'Timeline', label: 'Sprint & Timeline', icon: CalendarDays },
            { id: 'Dependencies', label: 'Dependencies', icon: GitMerge }
          ]
        },
        {
          title: 'INTELLIGENCE',
          items: [
            { id: 'Risk Center', label: 'My Risks', icon: ShieldAlert, badge: badges.risks }
          ]
        },
        {
          title: 'COLLABORATION',
          items: [
            { id: 'Team Workload', label: 'Team', icon: Users2 },
            { id: 'Meetings', label: 'Meetings', icon: Video },
            { id: 'Documents', label: 'Documents', icon: FileText }
          ]
        },
        {
          title: 'DELIVERY',
          items: [
            { id: 'Deliverables', label: 'Deliverables', icon: FileCheck2 }
          ]
        },
        {
          title: 'SYSTEM',
          items: [
            { id: 'Notifications', label: 'Notifications', icon: Bell, badge: badges.notifications },
            { id: 'Settings', label: 'Settings', icon: Settings }
          ]
        }
      ];

    case 'client':
      return [
        {
          title: 'PROJECT DELIVERY',
          items: [
            { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Projects', label: 'Projects', icon: FolderKanban, badge: badges.projects },
            { id: 'Timeline', label: 'Timeline & Milestones', icon: CalendarDays }
          ]
        },
        {
          title: 'DELIVERY & REVIEWS',
          items: [
            { id: 'Deliverables', label: 'Deliverables', icon: FileCheck2 },
            { id: 'Change Requests', label: 'Change Requests', icon: GitPullRequest, badge: badges.cr },
            { id: 'Approvals', label: 'Approvals', icon: CheckCircle2, badge: badges.approvals }
          ]
        },
        {
          title: 'COLLABORATION',
          items: [
            { id: 'Meetings', label: 'Meetings', icon: Video },
            { id: 'Documents', label: 'Documents', icon: FileText }
          ]
        },
        {
          title: 'SYSTEM',
          items: [
            { id: 'Notifications', label: 'Notifications', icon: Bell, badge: badges.notifications },
            { id: 'Settings', label: 'Settings', icon: Settings }
          ]
        }
      ];

    case 'exec':
      return [
        {
          title: 'STRATEGIC PORTFOLIO',
          items: [
            { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Projects', label: 'Portfolio Projects', icon: FolderKanban, badge: badges.projects }
          ]
        },
        {
          title: 'STRATEGIC INTELLIGENCE',
          items: [
            { id: 'Risk Center', label: 'Strategic Risks', icon: ShieldAlert, badge: badges.risks },
            { id: 'Analytics', label: 'Financials / EVM', icon: BarChart2 }
          ]
        },
        {
          title: 'EXECUTIVE GOVERNANCE',
          items: [
            { id: 'Deliverables', label: 'Deliverables', icon: FileCheck2 },
            { id: 'Approvals', label: 'Strategic Approvals', icon: CheckCircle2, badge: badges.approvals },
            { id: 'Documents', label: 'Reports & Briefs', icon: FileText }
          ]
        },
        {
          title: 'SYSTEM',
          items: [
            { id: 'Notifications', label: 'Notifications', icon: Bell, badge: badges.notifications },
            { id: 'Settings', label: 'Settings', icon: Settings }
          ]
        }
      ];

    case 'admin':
      return [
        {
          title: 'PLATFORM GOVERNANCE',
          items: [
            { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Team Workload', label: 'Users & Permissions', icon: Users2 },
            { id: 'Projects', label: 'Projects Directory', icon: FolderKanban, badge: badges.projects }
          ]
        },
        {
          title: 'INFRASTRUCTURE & AUDIT',
          items: [
            { id: 'Settings', label: 'ML Service & Config', icon: Settings },
            { id: 'Documents', label: 'System Logs & Ledger', icon: FileText }
          ]
        },
        {
          title: 'SYSTEM',
          items: [
            { id: 'Notifications', label: 'System Alerts', icon: Bell, badge: badges.notifications }
          ]
        }
      ];

    case 'manager':
    default:
      return [
        {
          title: 'WORKSPACE',
          items: [
            { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Projects', label: 'Projects', icon: FolderKanban, badge: badges.projects },
            { id: 'Tasks', label: 'Tasks', icon: CheckSquare, badge: badges.tasks },
            { id: 'Timeline', label: 'Timeline', icon: CalendarDays },
            { id: 'Dependencies', label: 'Dependencies', icon: GitMerge }
          ]
        },
        {
          title: 'INTELLIGENCE',
          items: [
            { id: 'Risk Center', label: 'Risks & Intelligence', icon: ShieldAlert, badge: badges.risks },
            { id: 'Analytics', label: 'Analytics', icon: BarChart2 }
          ]
        },
        {
          title: 'COLLABORATION',
          items: [
            { id: 'Team Workload', label: 'Team', icon: Users2 },
            { id: 'Meetings', label: 'Meetings', icon: Video },
            { id: 'Documents', label: 'Documents', icon: FileText }
          ]
        },
        {
          title: 'DELIVERY',
          items: [
            { id: 'Deliverables', label: 'Deliverables', icon: FileCheck2 },
            { id: 'Change Requests', label: 'Change Requests', icon: GitPullRequest, badge: badges.cr },
            { id: 'Approvals', label: 'Approvals', icon: CheckCircle2, badge: badges.approvals }
          ]
        },
        {
          title: 'SYSTEM',
          items: [
            { id: 'Notifications', label: 'Notifications', icon: Bell, badge: badges.notifications },
            { id: 'Settings', label: 'Settings', icon: Settings }
          ]
        }
      ];
  }
}

export default function Sidebar() {
  const {
    activeView,
    setActiveView,
    projects,
    tasks,
    approvals,
    changeRequests,
    notifications,
    unreadCount,
    activeRole,
    setIsCopilotOpen
  } = useProject();

  const roleId = activeRole?.id || 'manager';
  const criticalRiskCount = tasks.filter(t => t.risk >= 65 || t.blocked).length;
  const myTasksCount = tasks.filter(t => t.assignee?.includes('Kabir') || t.assignee?.includes(activeRole?.name?.split(' ')[0])).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending Review').length;

  const badges = {
    projects: (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#131522] text-[#8992A8] font-semibold font-mono border border-[#252A3A]">
        {projects.length}
      </span>
    ),
    tasks: (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4F7CFF]/15 text-[#8EB0FF] border border-[#4F7CFF]/30 font-semibold font-mono">
        {tasks.length}
      </span>
    ),
    myTasks: (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#4F7CFF]/15 text-[#8EB0FF] border border-[#4F7CFF]/30 font-semibold font-mono">
        {myTasksCount}
      </span>
    ),
    risks: criticalRiskCount > 0 ? (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FF4D6D]/15 text-[#FF859B] border border-[#FF4D6D]/30 font-bold font-mono pulse-danger">
        {criticalRiskCount}
      </span>
    ) : null,
    approvals: pendingApprovalsCount > 0 ? (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F5B942]/15 text-[#F8CB6E] border border-[#F5B942]/30 font-bold font-mono">
        {pendingApprovalsCount}
      </span>
    ) : null,
    cr: changeRequests.length > 0 ? (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7C5CFF]/15 text-[#AE9AFF] border border-[#7C5CFF]/30 font-bold font-mono">
        {changeRequests.length}
      </span>
    ) : null,
    notifications: unreadCount > 0 ? (
      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#39D9FF]/15 text-[#83E7FF] border border-[#39D9FF]/30 font-bold font-mono">
        {unreadCount}
      </span>
    ) : null
  };

  const navGroups = getRoleNavGroups(roleId, badges);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[250px] flex-col border-r border-[#252A3A] bg-[#0D101A] z-20 select-none">
      {/* Brand Header */}
      <div className="px-5 pt-4 pb-3.5 border-b border-[#252A3A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7CFF] to-[#7C5CFF] text-white font-black grid place-items-center text-sm shadow-md shadow-[#4F7CFF]/25 tracking-wider">
            IX
          </div>
          <div>
            <div className="font-black text-base text-[#F4F7FF] tracking-tight flex items-center gap-1.5">
              INTELIX
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#171A2A] text-[#39D9FF] border border-[#252A3A] font-mono">
                AI COMMAND
              </span>
            </div>
            <div className="text-[10px] text-[#8992A8] font-medium tracking-tight">
              Project Execution Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="px-3 py-3 space-y-4 flex-1 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#555E73]">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon, badge }) => {
                const isActive = activeView === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#4F7CFF]/12 text-[#F4F7FF] border border-[#4F7CFF]/35 shadow-[0_0_12px_rgba(79,124,255,0.12)]'
                        : 'text-[#8992A8] hover:bg-[#131522] hover:text-[#F4F7FF] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isActive ? 'text-[#39D9FF]' : 'text-[#555E73]'}
                      />
                      <span>{label}</span>
                    </div>
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Assistant Quick Trigger */}
      <div className="p-3 border-t border-[#252A3A]">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#131522] hover:bg-[#171A2A] border border-[#252A3A] hover:border-[#7C5CFF]/40 text-[#F4F7FF] transition group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#7C5CFF]/20 text-[#AE9AFF] grid place-items-center">
              <Sparkles size={13} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#F4F7FF]">Intelix Assistant</div>
              <div className="text-[10px] text-[#8992A8]">Ask questions or simulate</div>
            </div>
          </div>
          <kbd className="text-[10px] bg-[#0D101A] px-1.5 py-0.5 rounded text-[#8992A8] border border-[#252A3A] font-mono">
            Ctrl+/
          </kbd>
        </button>
      </div>

      {/* Current User Profile Footer */}
      <div className="p-3 border-t border-[#252A3A] bg-[#080A12]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#171A2A] to-[#131522] text-[#F4F7FF] border border-[#252A3A] grid place-items-center text-xs font-bold shrink-0 font-mono">
              {activeRole.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#F4F7FF] truncate">{activeRole.name}</div>
              <div className="text-[10px] text-[#39D9FF] font-medium truncate flex items-center gap-1">
                <span>{activeRole.badge}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" title="Online status: Connected to Intelligence Engine">
            <span className="w-2 h-2 rounded-full bg-[#18C997] shadow-[0_0_8px_rgba(24,201,151,0.6)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
