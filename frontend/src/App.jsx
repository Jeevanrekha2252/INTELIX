import React, { useState } from 'react';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/ToastContainer';
import SearchCommandPalette from './components/SearchCommandPalette';
import AiCopilotModal from './components/AiCopilotModal';
import NotificationDrawer from './components/NotificationDrawer';
import CreateTaskModal from './components/CreateTaskModal';
import CreateProjectModal from './components/CreateProjectModal';
import ProjectDrilldownModal from './components/ProjectDrilldownModal';

import LandingPageView from './views/LandingPageView';
import LoginPageView from './views/LoginPageView';

import OverviewView from './views/OverviewView';
import ProjectsView from './views/ProjectsView';
import TasksView from './views/TasksView';
import TimelineView from './views/TimelineView';
import DependenciesView from './views/DependenciesView';
import WorkloadView from './views/WorkloadView';
import RiskCenterView from './views/RiskCenterView';
import AnalyticsView from './views/AnalyticsView';
import DeliverablesView from './views/DeliverablesView';
import ChangeRequestsView from './views/ChangeRequestsView';
import ApprovalsView from './views/ApprovalsView';
import MeetingsView from './views/MeetingsView';
import DocumentsView from './views/DocumentsView';
import NotificationsView from './views/NotificationsView';
import SettingsView from './views/SettingsView';
import UsersView from './views/UsersView';

export const ROLE_ALLOWED_VIEWS = {
  manager: [
    'Overview', 'Projects', 'Tasks', 'Timeline', 'Dependencies',
    'Risk Center', 'Analytics', 'Team Workload', 'Deliverables',
    'Change Requests', 'Approvals', 'Meetings', 'Documents',
    'Users', 'Notifications', 'Settings'
  ],
  dev: [
    'Overview', 'Projects', 'Tasks', 'Timeline', 'Dependencies',
    'Risk Center', 'Team Workload', 'Deliverables', 'Meetings',
    'Documents', 'Notifications', 'Settings'
  ],
  client: [
    'Overview', 'Projects', 'Timeline', 'Deliverables',
    'Change Requests', 'Approvals', 'Meetings', 'Documents',
    'Notifications', 'Settings'
  ],
  exec: [
    'Overview', 'Projects', 'Risk Center', 'Analytics',
    'Deliverables', 'Approvals', 'Documents', 'Notifications', 'Settings'
  ],
  admin: [
    'Overview', 'Users', 'Team Workload', 'Projects', 'Documents',
    'Notifications', 'Settings'
  ]
};

function AppContent() {
  const { activeView, setActiveView, appMode, isAuthenticated, activeRole } = useProject();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in Public Marketing Landing Mode
  if (appMode === 'landing') {
    return (
      <>
        <LandingPageView />
        <ToastContainer />
      </>
    );
  }

  // ROOT ROUTE: If not authenticated, ALWAYS render the Unified Login Page
  if (!isAuthenticated || appMode === 'login') {
    return (
      <>
        <LoginPageView />
        <ToastContainer />
      </>
    );
  }

  const roleId = activeRole?.id || 'manager';
  const allowedViews = ROLE_ALLOWED_VIEWS[roleId] || ROLE_ALLOWED_VIEWS.manager;

  // Authenticated Common Intelix Workspace
  const renderActiveView = () => {
    // If user's role does not allow this view, default to Overview
    if (!allowedViews.includes(activeView)) {
      return <OverviewView />;
    }

    switch (activeView) {
      case 'Overview':
        return <OverviewView />;
      case 'Projects':
        return <ProjectsView />;
      case 'Tasks':
        return <TasksView />;
      case 'Timeline':
        return <TimelineView />;
      case 'Dependencies':
        return <DependenciesView />;
      case 'Risk Center':
        return <RiskCenterView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Team Workload':
        return <WorkloadView />;
      case 'Deliverables':
        return <DeliverablesView />;
      case 'Change Requests':
        return <ChangeRequestsView />;
      case 'Approvals':
        return <ApprovalsView />;
      case 'Meetings':
        return <MeetingsView />;
      case 'Documents':
        return <DocumentsView />;
      case 'Notifications':
        return <NotificationsView />;
      case 'Settings':
        return <SettingsView />;
      case 'Users':
        return <UsersView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F4F7FF] flex flex-col antialiased selection:bg-[#4F7CFF]/30 selection:text-[#8EB0FF]">
      {/* Desktop Sidebar (250px) */}
      <Sidebar />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0D101A] border-r border-[#252A3A] p-5 flex flex-col z-50">
            <div className="flex items-center gap-3 pb-5 border-b border-[#252A3A]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#7C5CFF] grid place-items-center shadow-md shadow-[#4F7CFF]/20">
                <span className="font-black text-sm text-white">IX</span>
              </div>
              <div>
                <div className="font-black text-lg text-white">INTELIX<span className="text-[#39D9FF]">.</span></div>
                <div className="text-[9px] uppercase tracking-wider text-[#8992A8]">{activeRole.roleTitle}</div>
              </div>
            </div>

            <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
              {allowedViews.map(view => (
                <button
                  key={view}
                  onClick={() => {
                    setActiveView(view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeView === view
                      ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
                      : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
                  }`}
                >
                  {view}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Topbar */}
      <Topbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <main className="lg:ml-[250px] pt-16 min-h-screen flex-1 flex flex-col">
        <div className="grid-bg flex-1">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            {renderActiveView()}

            {/* Footer */}
            <footer className="mt-14 pt-6 border-t border-[#252A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#555E73]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#8992A8]">INTELIX</span>
                <span>•</span>
                <span>AI Project Execution Intelligence Platform</span>
                <span>•</span>
                <span className="text-[#39D9FF] font-mono">"See the risk. Understand the cause. Act before the delay."</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#8992A8]">
                  <ShieldCheck size={14} className="text-[#18C997]" />
                  RBAC Active · Decision Engine Online · FIPS 140-3
                </span>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Global Interactive Modals & Drawers */}
      <SearchCommandPalette />
      <AiCopilotModal />
      <NotificationDrawer />
      <CreateTaskModal />
      <CreateProjectModal />
      <ProjectDrilldownModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
