import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Building2,
  Users,
  Calendar,
  DollarSign,
  ShieldCheck,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
  Layers,
  Lock,
  ExternalLink,
  Info,
  CheckCircle2,
  Search,
  UserPlus
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import api from '../services/api';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Info },
  { id: 2, name: 'Client', icon: Building2 },
  { id: 3, name: 'Team', icon: Users },
  { id: 4, name: 'Structure', icon: Layers },
  { id: 5, name: 'Terms', icon: FileText },
  { id: 6, name: 'Payments', icon: DollarSign },
  { id: 7, name: 'Responsibilities', icon: ShieldCheck },
  { id: 8, name: 'Review', icon: CheckCircle2 },
  { id: 9, name: 'Activate', icon: Sparkles }
];

const DEFAULT_MILESTONES = [
  { id: 'm-1', name: 'UI/UX & Design Architecture', description: 'Interactive prototypes, component library tokens, design system sign-off.', dueDate: '2026-10-15', deliverables: 'Figma prototypes, UI kit, typography hierarchy', acceptanceCriteria: 'Stakeholder sign-off and accessibility approval', priority: 'HIGH', orderIndex: 1 },
  { id: 'm-2', name: 'Backend Services & Core Ingestion', description: 'Database schema migrations, REST endpoints, JWT authorization.', dueDate: '2026-10-31', deliverables: 'REST APIs, DB migrations, automated test suite', acceptanceCriteria: '90%+ code coverage, Swagger contract passes', priority: 'HIGH', orderIndex: 2 },
  { id: 'm-3', name: 'Frontend Integration & Telemetry', description: 'Connect web UI to reactive data feeds, telemetry visualizations.', dueDate: '2026-11-15', deliverables: 'Reactive dashboard, telemetry charts, role views', acceptanceCriteria: 'Real-time sync test passing with sub-second latency', priority: 'MEDIUM', orderIndex: 3 },
  { id: 'm-4', name: 'Quality Assurance & Security Audit', description: 'End-to-end integration tests, penetration testing, load testing.', dueDate: '2026-11-25', deliverables: 'QA report, vulnerability remediation patch', acceptanceCriteria: 'Zero critical or high severity defects open', priority: 'HIGH', orderIndex: 4 },
  { id: 'm-5', name: 'Production Deployment & Acceptance', description: 'Staging to production rollout, DNS configuration, client handover.', dueDate: '2026-11-30', deliverables: 'Production deployment, handover runbook, training', acceptanceCriteria: 'Client UAT sign-off and production baseline verification', priority: 'CRITICAL', orderIndex: 5 }
];

const DEFAULT_RESPONSIBILITIES = [
  { id: 'r-1', ownerRole: 'CLIENT', ownerName: 'Client Stakeholder', title: 'Deliver Staging Cloud Credentials & API Keys', description: 'Supply staging AWS sandbox root credentials, payment webhook secrets, and VPN access.', dueDate: '2026-10-05', impactIfDelayed: 'Backend environment cannot be provisioned; blocks API ingestion.', linkedMilestoneName: 'Backend Services & Core Ingestion', status: 'PENDING' },
  { id: 'r-2', ownerRole: 'CLIENT', ownerName: 'Client Stakeholder', title: 'Review & Sign Off UI/UX Deliverables within SLA', description: 'Review provided Figma prototypes and design tokens within the 5-day review window.', dueDate: '2026-10-20', impactIfDelayed: 'Frontend development will freeze or diverge from design specs.', linkedMilestoneName: 'UI/UX & Design Architecture', status: 'PENDING' },
  { id: 'r-3', ownerRole: 'MANAGER', ownerName: 'Project Manager', title: 'Maintain Project Baseline, Resource Allocation & Risk Register', description: 'Track milestone variance, conduct weekly status syncs, manage critical path blockers.', dueDate: 'Ongoing', impactIfDelayed: 'Milestone slippage and unaccounted schedule drift.', linkedMilestoneName: 'UI/UX & Design Architecture', status: 'IN_PROGRESS' },
  { id: 'r-4', ownerRole: 'MANAGER', ownerName: 'Project Manager', title: 'Formalize Baseline Amendments upon Client Change Requests', description: 'Submit formal amendment for any scope variance within 48 hours of notice.', dueDate: 'As needed', impactIfDelayed: 'Scope creep without contractually recognized deadline extension.', linkedMilestoneName: 'Quality Assurance & Security Audit', status: 'PENDING' },
  { id: 'r-5', ownerRole: 'DEVELOPER', ownerName: 'Engineering Team', title: 'Deliver Clean Production Code & Automated Unit Tests', description: 'Implement feature requirements according to architectural specifications with test coverage.', dueDate: 'Sprint Milestones', impactIfDelayed: 'Delayed milestone completion and delayed payment tranches.', linkedMilestoneName: 'Backend Services & Core Ingestion', status: 'PENDING' },
  { id: 'r-6', ownerRole: 'DEVELOPER', ownerName: 'Engineering Team', title: 'Report Dependency Blockers Immediately in Daily Telemetry', description: 'Flag any external impediment or third-party API outage within 2 hours of discovery.', dueDate: 'Continuous', impactIfDelayed: 'Unverified delays cannot be attributed to client dependencies.', linkedMilestoneName: 'Frontend Integration & Telemetry', status: 'PENDING' }
];

export default function CreateProjectModal() {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    activeRole,
    projectDrafts,
    submitInitiationWizard,
    setActiveView,
    setDrilldownProject
  } = useProject();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [draftResumeNotice, setDraftResumeNotice] = useState(true);

  // Available data lists
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [isNewClientModal, setIsNewClientModal] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: ''
  });

  // Main Wizard State
  const [wizardData, setWizardData] = useState({
    projectId: null,
    basicInfo: {
      title: '',
      projectKey: '',
      description: '',
      projectObjective: '',
      category: 'Infrastructure',
      startDate: '2026-10-01',
      endDate: '2026-11-30',
      priority: 'HIGH',
      projectType: 'Fixed Price',
      timezone: 'UTC+05:30',
      budget: 1250000,
      tags: 'IoT Sensors, PostgreSQL, React, Spring Boot'
    },
    client: {
      clientId: '',
      name: '',
      email: '',
      phone: '',
      organization: '',
      designation: ''
    },
    teams: [
      { id: 't-1', name: 'Core Backend Team', description: 'APIs, Database, Auth & Event Bus', leadId: '', memberIds: [] },
      { id: 't-2', name: 'Frontend & UI Team', description: 'React, Tailwind, Telemetry Charts', leadId: '', memberIds: [] },
      { id: 't-3', name: 'QA & Compliance Team', description: 'End-to-end testing, security audits', leadId: '', memberIds: [] }
    ],
    milestones: DEFAULT_MILESTONES,
    tasks: [
      { id: 'tsk-1', title: 'Draft API Contracts & OpenAPI Spec', description: 'Define endpoints and schema for frontend consumed entities', teamName: 'Core Backend Team', assigneeId: '', priority: 'HIGH', startDate: '2026-10-01', dueDate: '2026-10-08', estimatedHours: 24, predecessorIndex: null },
      { id: 'tsk-2', title: 'Deploy PostgreSQL Schema & Seed Data', description: 'Initial schema migrations and connection pool setup', teamName: 'Core Backend Team', assigneeId: '', priority: 'CRITICAL', startDate: '2026-10-08', dueDate: '2026-10-15', estimatedHours: 16, predecessorIndex: 0 }
    ],
    terms: {
      scopeObjective: 'Deliver fully functional, automated campus infrastructure and project tracking with end-to-end telemetry and client baseline governance.',
      includedModules: '• Project Governance & Agreement Baseline Module\n• Real-Time Task Execution & Blocker Telemetry\n• Automated Payment Milestone Triggers\n• Stakeholder Responsibilities Matrix (RACI)\n• ML Risk & Delay Forecasting Engine',
      excludedModules: '• Legacy physical hardware maintenance\n• Third-party payment gateway transaction fees',
      assumptions: '• Staging cloud credentials delivered by Client within 5 calendar days of agreement lock.\n• Client stakeholders review and sign off deliverables within the agreed 5 business day window.',
      agreedDeliverables: '1. Architecture & API Specifications Document\n2. Reactive Web Dashboard with Role-Based Access Control\n3. Quality Assurance Report & Security Compliance Sign-Off\n4. Handover Runbook & Production Deployment',
      reviewPeriodDays: 5,
      approvalPeriodDays: 3,
      delayAttribution: 'Rule 6 Delay Compensation: Verified client-caused dependency delays automatically shift the project schedule day-for-day without financial penalty.',
      generalTerms: 'All modifications to agreed scope, deliverables, payment tranches, or deadlines require a formal bilateral Project Amendment.'
    },
    payments: {
      totalValue: 1250000,
      currency: 'USD',
      paymentMilestones: [
        { id: 'p-1', title: 'Initiation & Baseline Agreement Lock', triggerType: 'PERCENTAGE', triggerValue: 20, paymentPercentage: 20, paymentAmount: 250000, dueDate: '2026-10-15', notes: 'Triggered upon agreement execution and sprint setup', status: 'PENDING' },
        { id: 'p-2', title: 'Architecture & Core Ingestion Completion', triggerType: 'PERCENTAGE', triggerValue: 50, paymentPercentage: 30, paymentAmount: 375000, dueDate: '2026-10-31', notes: 'Triggered at 50% milestone progress', status: 'PENDING' },
        { id: 'p-3', title: 'Integration & Beta Staging Handover', triggerType: 'PERCENTAGE', triggerValue: 80, paymentPercentage: 30, paymentAmount: 375000, dueDate: '2026-11-15', notes: 'Triggered at 80% test coverage & UAT build', status: 'PENDING' },
        { id: 'p-4', title: 'Production Go-Live & Final Acceptance', triggerType: 'PERCENTAGE', triggerValue: 100, paymentPercentage: 20, paymentAmount: 250000, dueDate: '2026-11-30', notes: 'Triggered upon 100% completion & sign-off', status: 'PENDING' }
      ]
    },
    responsibilities: DEFAULT_RESPONSIBILITIES
  });

  // Fetch employees with workload & clients list
  useEffect(() => {
    if (!isCreateProjectOpen) return;

    api.getEmployeesWorkload()
      .then(res => {
        if (Array.isArray(res)) setEmployees(res);
      })
      .catch(() => {
        // Fallback default employees if backend offline
        setEmployees([
          { userId: 'u-dev1', fullName: 'Aarav Patel', email: 'aarav@demo.com', role: 'EMPLOYEE', title: 'Senior Backend Engineer', currentWorkloadPercentage: 45, workloadStatus: 'HEALTHY', activeTasksCount: 3, capacityHoursPerWeek: 40, activeProjects: ['Campus SCMS'] },
          { userId: 'u-dev2', fullName: 'Priya Sharma', email: 'priya@demo.com', role: 'EMPLOYEE', title: 'Frontend UI Lead', currentWorkloadPercentage: 70, workloadStatus: 'HEALTHY', activeTasksCount: 4, capacityHoursPerWeek: 40, activeProjects: ['Civic Portal'] },
          { userId: 'u-dev3', fullName: 'Rohan Gupta', email: 'rohan@demo.com', role: 'EMPLOYEE', title: 'Fullstack Dev', currentWorkloadPercentage: 110, workloadStatus: 'OVERLOADED', activeTasksCount: 7, capacityHoursPerWeek: 40, activeProjects: ['Campus SCMS', 'Health Grid'] },
          { userId: 'u-dev4', fullName: 'Neha Singh', email: 'neha@demo.com', role: 'EMPLOYEE', title: 'QA Automation Lead', currentWorkloadPercentage: 55, workloadStatus: 'HEALTHY', activeTasksCount: 2, capacityHoursPerWeek: 40, activeProjects: ['Civic Portal'] }
        ]);
      });

    api.getClients()
      .then(res => {
        if (Array.isArray(res)) setClients(res);
      })
      .catch(() => {
        setClients([
          { id: 'c-1', fullName: 'Dr. David Vance', email: 'david.vance@university.edu', title: 'Dean of Technology', role: 'CLIENT' },
          { id: 'c-2', fullName: 'Sophia Sterling', email: 'client@demo.com', title: 'VP Digital Strategy (Global Labs)', role: 'CLIENT' },
          { id: 'c-3', fullName: 'Vikram Malhotra', email: 'v.malhotra@smartinfra.gov', title: 'Director of Operations', role: 'CLIENT' }
        ]);
      });
  }, [isCreateProjectOpen]);

  // Auto-generate project key from title
  const handleTitleChange = (val) => {
    const autoKey = val
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .substring(0, 4) || 'PRJ';

    setWizardData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        title: val,
        projectKey: prev.basicInfo.projectKey === '' || prev.basicInfo.projectKey.startsWith('PRJ') ? `IX-${autoKey}` : prev.basicInfo.projectKey
      }
    }));
  };

  // Check payment percentages
  const paymentTotals = useMemo(() => {
    const pms = wizardData.payments.paymentMilestones || [];
    const sumPct = pms.reduce((acc, p) => acc + (parseFloat(p.paymentPercentage) || 0), 0);
    const sumAmt = pms.reduce((acc, p) => acc + (parseFloat(p.paymentAmount) || 0), 0);
    const isValid = Math.abs(sumPct - 100) < 0.1;
    return { sumPct, sumAmt, isValid };
  }, [wizardData.payments]);

  if (!isCreateProjectOpen) return null;

  // Save Draft Action
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const payload = {
      ...wizardData,
      action: 'SAVE_DRAFT',
      currentStep: currentStep
    };
    await submitInitiationWizard(payload);
    setIsSubmitting(false);
  };

  // Submit to Client for Review
  const handleSubmitForReview = async () => {
    // Basic validation
    if (!wizardData.basicInfo.title.trim()) {
      alert('Please provide a Project Title in Step 1.');
      setCurrentStep(1);
      return;
    }
    if (!wizardData.client.clientId && !wizardData.client.email) {
      alert('Please assign a Client in Step 2.');
      setCurrentStep(2);
      return;
    }
    if (!paymentTotals.isValid) {
      alert(`Payment percentages must total 100%. Current sum: ${paymentTotals.sumPct}%`);
      setCurrentStep(6);
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...wizardData,
      action: 'SUBMIT_TO_CLIENT',
      currentStep: 8
    };

    const res = await submitInitiationWizard(payload);
    setIsSubmitting(false);

    if (res && res.success) {
      setCreatedResult({
        ...res,
        title: wizardData.basicInfo.title,
        clientName: wizardData.client.name || wizardData.client.organization || 'Client Stakeholder',
        managerName: activeRole.name,
        deadline: wizardData.basicInfo.endDate,
        budget: wizardData.payments.totalValue,
        teamsCount: wizardData.teams.length
      });
      setCurrentStep(9); // Move to final activation confirmation
    }
  };

  // Resume Draft handler
  const handleResumeDraft = (draft) => {
    if (draft.rawPayload) {
      setWizardData(draft.rawPayload);
      setCurrentStep(draft.currentStep || 1);
    } else {
      setWizardData(prev => ({
        ...prev,
        projectId: draft.projectId,
        basicInfo: {
          ...prev.basicInfo,
          title: draft.name,
          projectKey: draft.projectKey,
          description: draft.description
        }
      }));
      setCurrentStep(draft.currentStep || 1);
    }
    setDraftResumeNotice(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="surface-modal rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800 bg-[#0B0F19] text-slate-100 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header & Progress Indicator */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Briefcase size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Governance Initiation Wizard
                  </span>
                  <span className="text-xs text-slate-400">Step {currentStep} of 9</span>
                </div>
                <h2 className="text-base font-black text-white tracking-tight mt-0.5">
                  {currentStep === 9 ? 'Project Initiated Successfully' : 'Create New Project & Baseline Agreement'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentStep < 9 && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                  title="Save current progress as draft and resume later"
                >
                  <Save size={13} />
                  <span>Save Draft</span>
                </button>
              )}

              <button
                onClick={() => setIsCreateProjectOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Stepper Strip */}
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center justify-between min-w-[720px] gap-1 px-1">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isDone = currentStep > s.id;
                const isCurrent = currentStep === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (currentStep !== 9) setCurrentStep(s.id);
                    }}
                    className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                        : isDone
                        ? 'text-emerald-400 hover:bg-slate-800/60'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-white text-blue-600'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {isDone ? <Check size={11} className="stroke-[3]" /> : s.id}
                    </div>
                    <span className="truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Existing Draft Resume Banner */}
        {draftResumeNotice && projectDrafts && projectDrafts.length > 0 && currentStep === 1 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Unfinished Draft Detected: </span>
                <span>"{projectDrafts[0].name}" saved at Step {projectDrafts[0].currentStep || 1}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleResumeDraft(projectDrafts[0])}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all text-[11px]"
              >
                Resume Draft
              </button>
              <button
                type="button"
                onClick={() => setDraftResumeNotice(false)}
                className="text-amber-400 hover:text-amber-200 text-[11px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Step Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-200">Pre-Execution Rule:</strong> This project will be initialized in <span className="font-mono bg-blue-900/60 px-1.5 py-0.5 rounded text-white">DRAFT_SETUP</span>. Task execution remains locked until all commercial terms and responsibilities are formally agreed with the client.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Campus Management System"
                    value={wizardData.basicInfo.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Project Key * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IX-SCMS"
                    value={wizardData.basicInfo.projectKey}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, projectKey: e.target.value.toUpperCase() }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-blue-300 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Description & Context *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="High level overview, business purpose, and target stakeholders..."
                  value={wizardData.basicInfo.description}
                  onChange={e => setWizardData(prev => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, description: e.target.value }
                  }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Core Project Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deliver automated, real-time energy telemetry and student ID access across 12 university buildings."
                  value={wizardData.basicInfo.projectObjective}
                  onChange={e => setWizardData(prev => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, projectObjective: e.target.value }
                  }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={wizardData.basicInfo.category}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, category: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Civic Tech">Civic Tech</option>
                    <option value="AI & Analytics">AI & Analytics</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Enterprise IT">Enterprise IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={wizardData.basicInfo.priority}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, priority: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={wizardData.basicInfo.startDate}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, startDate: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Target End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={wizardData.basicInfo.endDate}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, endDate: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contract Type
                  </label>
                  <select
                    value={wizardData.basicInfo.projectType}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, projectType: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Fixed Price">Fixed Price Milestone Contract</option>
                    <option value="Time & Materials">Time & Materials</option>
                    <option value="Retainer">Monthly Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Timezone / Locale
                  </label>
                  <input
                    type="text"
                    value={wizardData.basicInfo.timezone}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, timezone: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tags & Tech Stack
                  </label>
                  <input
                    type="text"
                    placeholder="Comma separated..."
                    value={wizardData.basicInfo.tags}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, tags: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CLIENT SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Select or Register Project Client</h3>
                  <p className="text-xs text-slate-400">The assigned client will receive the Project Agreement for digital review and approval.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewClientModal(!isNewClientModal)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>{isNewClientModal ? 'Select Existing Client' : '+ New Client Profile'}</span>
                </button>
              </div>

              {/* Inline New Client Creator */}
              {isNewClientModal ? (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-3 animate-in fade-in">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Building2 size={14} />
                    <span>Create New Client Stakeholder Profile</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Client Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. David Vance"
                        value={newClientForm.name}
                        onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. david.vance@university.edu"
                        value={newClientForm.email}
                        onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Organization / Department</label>
                      <input
                        type="text"
                        placeholder="e.g. National University Council"
                        value={newClientForm.organization}
                        onChange={e => setNewClientForm({ ...newClientForm, organization: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Designation / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Dean of Academic Computing"
                        value={newClientForm.designation}
                        onChange={e => setNewClientForm({ ...newClientForm, designation: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newClientForm.email.trim() || !newClientForm.name.trim()) {
                        alert('Name and Email are required.');
                        return;
                      }
                      setWizardData(prev => ({
                        ...prev,
                        client: {
                          clientId: '',
                          name: newClientForm.name,
                          email: newClientForm.email,
                          phone: newClientForm.phone,
                          organization: newClientForm.organization,
                          designation: newClientForm.designation
                        }
                      }));
                      setIsNewClientModal(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                  >
                    Confirm & Select Client
                  </button>
                </div>
              ) : (
                /* Existing Clients List */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {clients.map(c => {
                    const isSelected = wizardData.client.clientId === c.id || wizardData.client.email === c.email;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setWizardData(prev => ({
                            ...prev,
                            client: {
                              clientId: c.id,
                              name: c.fullName,
                              email: c.email,
                              phone: '',
                              organization: c.title || 'Client Organization',
                              designation: c.title || 'Stakeholder'
                            }
                          }));
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                            {c.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          {isSelected && <span className="p-1 rounded-full bg-blue-500 text-white"><Check size={10} /></span>}
                        </div>
                        <div className="mt-2.5">
                          <h4 className="text-xs font-bold text-white">{c.fullName}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{c.title || 'Client Stakeholder'}</p>
                          <p className="text-[10px] text-blue-400 font-mono mt-1">{c.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Client Summary Card */}
              {wizardData.client.name && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Assigned Client</div>
                      <div className="text-xs font-bold text-white">{wizardData.client.name}</div>
                      <div className="text-[11px] text-slate-400">{wizardData.client.organization || wizardData.client.designation} • {wizardData.client.email}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                    Ready for Review SLA
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: TEAM & EMPLOYEES */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Resource Allocation & Team Structuring</h3>
                  <p className="text-xs text-slate-400">Review live developer workloads and assemble dedicated functional teams.</p>
                </div>
              </div>

              {/* Workload Diagnostic Table */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Users size={14} className="text-blue-400" />
                  <span>Available Employees & Live Capacity Diagnostics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {employees.map(emp => {
                    const isOverloaded = emp.workloadStatus === 'OVERLOADED';
                    const isHigh = emp.workloadStatus === 'HIGH';
                    return (
                      <div key={emp.userId} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white truncate">{emp.fullName}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isOverloaded
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isHigh
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {emp.currentWorkloadPercentage}% {emp.workloadStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{emp.title}</p>
                        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Active Tasks: {emp.activeTasksCount}</span>
                          <span>Cap: {emp.capacityHoursPerWeek}h/wk</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Functional Teams Configurator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Project Teams</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newTeam = {
                        id: `t-${Date.now()}`,
                        name: 'New Functional Team',
                        description: 'Specialized domain responsibilities',
                        leadId: '',
                        memberIds: []
                      };
                      setWizardData(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Team</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {wizardData.teams.map((team, idx) => (
                    <div key={team.id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={team.name}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.teams];
                              updated[idx].name = val;
                              return { ...prev, teams: updated };
                            });
                          }}
                          className="bg-transparent border-b border-slate-700 focus:border-blue-500 text-xs font-bold text-white px-1 py-0.5 outline-none flex-1"
                        />
                        {wizardData.teams.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setWizardData(prev => ({
                                ...prev,
                                teams: prev.teams.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Team Lead</label>
                          <select
                            value={team.leadId || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.teams];
                                updated[idx].leadId = val;
                                return { ...prev, teams: updated };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                          >
                            <option value="">-- Assign Lead --</option>
                            {employees.map(e => (
                              <option key={e.userId} value={e.userId}>{e.fullName} ({e.title})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Add Members</label>
                          <select
                            onChange={e => {
                              const val = e.target.value;
                              if (!val) return;
                              setWizardData(prev => {
                                const updated = [...prev.teams];
                                if (!updated[idx].memberIds.includes(val)) {
                                  updated[idx].memberIds.push(val);
                                }
                                return { ...prev, teams: updated };
                              });
                              e.target.value = '';
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                          >
                            <option value="">+ Select Developer to Add</option>
                            {employees.map(e => (
                              <option key={e.userId} value={e.userId}>{e.fullName} ({e.currentWorkloadPercentage}% utilized)</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selected members chips */}
                      {team.memberIds && team.memberIds.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {team.memberIds.map(mId => {
                            const emp = employees.find(e => e.userId === mId);
                            return (
                              <span key={mId} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5">
                                <span>{emp ? emp.fullName : mId}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWizardData(prev => {
                                      const updated = [...prev.teams];
                                      updated[idx].memberIds = updated[idx].memberIds.filter(id => id !== mId);
                                      return { ...prev, teams: updated };
                                    });
                                  }}
                                  className="text-slate-500 hover:text-white"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROJECT STRUCTURE (MILESTONES & INITIAL TASKS) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Milestones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Project Milestones & Deliverables</h3>
                    <p className="text-xs text-slate-400">Formal agreed milestones that govern execution and trigger payment tranches.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newM = {
                        id: `m-${Date.now()}`,
                        name: 'New Project Milestone',
                        description: 'Deliverable specification',
                        dueDate: wizardData.basicInfo.endDate,
                        deliverables: 'Deliverable items',
                        acceptanceCriteria: 'Criteria for signoff',
                        priority: 'HIGH',
                        orderIndex: wizardData.milestones.length + 1
                      };
                      setWizardData(prev => ({ ...prev, milestones: [...prev.milestones, newM] }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {wizardData.milestones.map((m, idx) => (
                    <div key={m.id || idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={m.name}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.milestones];
                                updated[idx].name = val;
                                return { ...prev, milestones: updated };
                              });
                            }}
                            className="bg-transparent border-b border-slate-700 focus:border-blue-500 text-xs font-bold text-white px-1 py-0.5 outline-none flex-1"
                          />
                        </div>
                        <input
                          type="date"
                          value={m.dueDate}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.milestones];
                              updated[idx].dueDate = val;
                              return { ...prev, milestones: updated };
                            });
                          }}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300 outline-none"
                        />
                        {wizardData.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setWizardData(prev => ({
                                ...prev,
                                milestones: prev.milestones.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Agreed Deliverables</label>
                          <input
                            type="text"
                            value={m.deliverables}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.milestones];
                                updated[idx].deliverables = val;
                                return { ...prev, milestones: updated };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Acceptance Criteria</label>
                          <input
                            type="text"
                            value={m.acceptanceCriteria}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.milestones];
                                updated[idx].acceptanceCriteria = val;
                                return { ...prev, milestones: updated };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Tasks (Optional) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Initial Tasks & Finish-to-Start Dependencies (Optional)</h3>
                    <p className="text-xs text-slate-400">Managers can seed initial sprint tasks now or continue adding tasks after project activation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newT = {
                        id: `tsk-${Date.now()}`,
                        title: 'Sprint 1 Initialization Task',
                        description: 'Detailed execution task description',
                        teamName: wizardData.teams[0]?.name || 'Core Team',
                        assigneeId: '',
                        priority: 'MEDIUM',
                        startDate: wizardData.basicInfo.startDate,
                        dueDate: wizardData.basicInfo.endDate,
                        estimatedHours: 8,
                        predecessorIndex: null
                      };
                      setWizardData(prev => ({ ...prev, tasks: [...prev.tasks, newT] }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {wizardData.tasks.map((task, idx) => (
                    <div key={task.id || idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={task.title}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.tasks];
                              updated[idx].title = val;
                              return { ...prev, tasks: updated };
                            });
                          }}
                          className="bg-transparent border-b border-slate-700 text-xs font-bold text-white px-1 py-0.5 outline-none flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setWizardData(prev => ({
                              ...prev,
                              tasks: prev.tasks.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400">Team</label>
                          <select
                            value={task.teamName}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.tasks];
                                updated[idx].teamName = val;
                                return { ...prev, tasks: updated };
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none"
                          >
                            {wizardData.teams.map((t, i) => (
                              <option key={i} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400">Assignee</label>
                          <select
                            value={task.assigneeId || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.tasks];
                                updated[idx].assigneeId = val;
                                return { ...prev, tasks: updated };
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none"
                          >
                            <option value="">-- Unassigned --</option>
                            {employees.map(e => (
                              <option key={e.userId} value={e.userId}>{e.fullName}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400">Est. Hours</label>
                          <input
                            type="number"
                            value={task.estimatedHours}
                            onChange={e => {
                              const val = +e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.tasks];
                                updated[idx].estimatedHours = val;
                                return { ...prev, tasks: updated };
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400">Dependency Predecessor</label>
                          <select
                            value={task.predecessorIndex !== null && task.predecessorIndex !== undefined ? task.predecessorIndex : ''}
                            onChange={e => {
                              const val = e.target.value === '' ? null : +e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.tasks];
                                updated[idx].predecessorIndex = val;
                                return { ...prev, tasks: updated };
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none"
                          >
                            <option value="">None (Can start anytime)</option>
                            {wizardData.tasks.map((t, i) => {
                              if (i === idx) return null;
                              return <option key={i} value={i}>FS: Must finish after "{t.title.substring(0, 20)}..."</option>;
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TERMS & CONDITIONS (CATEGORIES A-L) */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300">
                <span className="font-bold text-white">Official Baseline Agreement (Categories A–L):</span> These structured clauses form the immutable foundation. Changes after activation require formal bilateral amendments.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Section A: Project Scope & Objectives
                </label>
                <textarea
                  rows={2}
                  value={wizardData.terms.scopeObjective}
                  onChange={e => setWizardData(prev => ({
                    ...prev,
                    terms: { ...prev.terms, scopeObjective: e.target.value }
                  }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    Section B: Included Scope & Modules
                  </label>
                  <textarea
                    rows={3}
                    value={wizardData.terms.includedModules}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, includedModules: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-400 mb-1">
                    Section C: Excluded Scope (Out-of-Scope)
                  </label>
                  <textarea
                    rows={3}
                    value={wizardData.terms.excludedModules}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, excludedModules: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-rose-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Section D: Key Operational Assumptions
                  </label>
                  <textarea
                    rows={2}
                    value={wizardData.terms.assumptions}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, assumptions: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Section E: Agreed Deliverables Package
                  </label>
                  <textarea
                    rows={2}
                    value={wizardData.terms.agreedDeliverables}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, agreedDeliverables: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Section I: Client Review SLA (Days)
                  </label>
                  <input
                    type="number"
                    value={wizardData.terms.reviewPeriodDays}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, reviewPeriodDays: +e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Approval Window SLA (Days)
                  </label>
                  <input
                    type="number"
                    value={wizardData.terms.approvalPeriodDays}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, approvalPeriodDays: +e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Section K: Delay Attribution Rule
                  </label>
                  <input
                    type="text"
                    value={wizardData.terms.delayAttribution}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      terms: { ...prev.terms, delayAttribution: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT TERMS */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                <Lock size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-white">Confidential Financial Details:</strong> Payment tranches are visible ONLY to Manager, Client, and Admin roles. Developers have zero access to commercial values.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Total Contract Baseline Value *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      value={wizardData.payments.totalValue}
                      onChange={e => {
                        const val = +e.target.value;
                        setWizardData(prev => {
                          // Recalculate milestone amounts based on percentage
                          const updated = prev.payments.paymentMilestones.map(p => ({
                            ...p,
                            paymentAmount: (val * (p.paymentPercentage || 0)) / 100
                          }));
                          return {
                            ...prev,
                            payments: { ...prev.payments, totalValue: val, paymentMilestones: updated }
                          };
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={wizardData.payments.currency}
                    onChange={e => setWizardData(prev => ({
                      ...prev,
                      payments: { ...prev.payments, currency: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Payment Schedule Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Payment Milestones Schedule</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      paymentTotals.isValid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {paymentTotals.isValid ? '✓ Exactly 100% Balanced' : `⚠️ Total is ${paymentTotals.sumPct}% (Must equal 100%)`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newPm = {
                        id: `pay-${Date.now()}`,
                        title: 'New Milestone Tranche',
                        triggerType: 'PERCENTAGE',
                        triggerValue: 50,
                        paymentPercentage: 0,
                        paymentAmount: 0,
                        dueDate: wizardData.basicInfo.endDate,
                        notes: 'Progress milestone trigger',
                        status: 'PENDING'
                      };
                      setWizardData(prev => ({
                        ...prev,
                        payments: {
                          ...prev.payments,
                          paymentMilestones: [...prev.payments.paymentMilestones, newPm]
                        }
                      }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Tranche</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {wizardData.payments.paymentMilestones.map((pm, idx) => (
                    <div key={pm.id || idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={pm.title}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.payments.paymentMilestones];
                              updated[idx].title = val;
                              return { ...prev, payments: { ...prev.payments, paymentMilestones: updated } };
                            });
                          }}
                          className="bg-transparent border-b border-slate-700 focus:border-blue-500 text-xs font-bold text-white px-1 py-0.5 outline-none flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setWizardData(prev => ({
                              ...prev,
                              payments: {
                                ...prev.payments,
                                paymentMilestones: prev.payments.paymentMilestones.filter((_, i) => i !== idx)
                              }
                            }));
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Trigger Condition</label>
                          <select
                            value={pm.triggerType}
                            onChange={e => {
                              const val = e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.payments.paymentMilestones];
                                updated[idx].triggerType = val;
                                return { ...prev, payments: { ...prev.payments, paymentMilestones: updated } };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px] outline-none"
                          >
                            <option value="PERCENTAGE">Project % Completion</option>
                            <option value="MILESTONE_COMPLETION">Milestone Completed</option>
                            <option value="FIXED_DATE">Fixed Calendar Date</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Trigger Value (%)</label>
                          <input
                            type="number"
                            value={pm.triggerValue || ''}
                            onChange={e => {
                              const val = +e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.payments.paymentMilestones];
                                updated[idx].triggerValue = val;
                                return { ...prev, payments: { ...prev.payments, paymentMilestones: updated } };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Percentage (%)</label>
                          <input
                            type="number"
                            value={pm.paymentPercentage}
                            onChange={e => {
                              const pct = +e.target.value;
                              setWizardData(prev => {
                                const updated = [...prev.payments.paymentMilestones];
                                updated[idx].paymentPercentage = pct;
                                updated[idx].paymentAmount = (prev.payments.totalValue * pct) / 100;
                                return { ...prev, payments: { ...prev.payments, paymentMilestones: updated } };
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[11px] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Amount ({wizardData.payments.currency})</label>
                          <div className="text-xs font-bold text-emerald-400 px-2 py-1 bg-slate-950 rounded border border-slate-800">
                            ${pm.paymentAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: RESPONSIBILITIES MATRIX */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Stakeholder Responsibilities Matrix (RACI)</h3>
                  <p className="text-xs text-slate-400">Explicit contractual obligations across Client, Manager, and Development Team.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newR = {
                      id: `r-${Date.now()}`,
                      ownerRole: 'CLIENT',
                      ownerName: wizardData.client.name || 'Client Stakeholder',
                      title: 'New Stakeholder Requirement',
                      description: 'Actionable obligation and acceptance requirement',
                      dueDate: wizardData.basicInfo.endDate,
                      impactIfDelayed: 'Schedule delay impact description',
                      linkedMilestoneName: wizardData.milestones[0]?.name || 'Milestone 1',
                      status: 'PENDING'
                    };
                    setWizardData(prev => ({
                      ...prev,
                      responsibilities: [...prev.responsibilities, newR]
                    }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>Add Obligation</span>
                </button>
              </div>

              <div className="space-y-3">
                {wizardData.responsibilities.map((resp, idx) => (
                  <div key={resp.id || idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={resp.ownerRole}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.responsibilities];
                              updated[idx].ownerRole = val;
                              return { ...prev, responsibilities: updated };
                            });
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border outline-none ${
                            resp.ownerRole === 'CLIENT'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : resp.ownerRole === 'MANAGER'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          <option value="CLIENT">CLIENT</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="DEVELOPER">DEVELOPER</option>
                        </select>
                        <input
                          type="text"
                          value={resp.title}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.responsibilities];
                              updated[idx].title = val;
                              return { ...prev, responsibilities: updated };
                            });
                          }}
                          className="bg-transparent border-b border-slate-700 text-xs font-bold text-white px-1 py-0.5 outline-none flex-1"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setWizardData(prev => ({
                            ...prev,
                            responsibilities: prev.responsibilities.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-400">Description</label>
                        <input
                          type="text"
                          value={resp.description}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.responsibilities];
                              updated[idx].description = val;
                              return { ...prev, responsibilities: updated };
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400">Impact if Delayed</label>
                        <input
                          type="text"
                          value={resp.impactIfDelayed}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.responsibilities];
                              updated[idx].impactIfDelayed = val;
                              return { ...prev, responsibilities: updated };
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-rose-300 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400">Due Date</label>
                        <input
                          type="text"
                          value={resp.dueDate}
                          onChange={e => {
                            const val = e.target.value;
                            setWizardData(prev => {
                              const updated = [...prev.responsibilities];
                              updated[idx].dueDate = val;
                              return { ...prev, responsibilities: updated };
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: REVIEW & AGREEMENT */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs text-blue-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400" />
                  <span>Review project setup. When submitted, the client receives real-time notification to review and digitally sign.</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-white bg-blue-600/30 px-2 py-0.5 rounded">
                  Version 1 Baseline
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Basic Info & Client */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">Initiative & Client</span>
                    <button type="button" onClick={() => setCurrentStep(1)} className="text-blue-400 hover:underline text-[11px]">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Project: </span>
                    <strong className="text-white">{wizardData.basicInfo.title || 'Untitled'}</strong> ({wizardData.basicInfo.projectKey})
                  </div>
                  <div>
                    <span className="text-slate-400">Client: </span>
                    <strong className="text-white">{wizardData.client.name || 'Client Stakeholder'}</strong> ({wizardData.client.organization})
                  </div>
                  <div>
                    <span className="text-slate-400">Dates: </span>
                    <span className="text-slate-200">{wizardData.basicInfo.startDate} → {wizardData.basicInfo.endDate}</span>
                  </div>
                </div>

                {/* Team & Milestones Summary */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">Team & Milestones</span>
                    <button type="button" onClick={() => setCurrentStep(3)} className="text-blue-400 hover:underline text-[11px]">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Teams Configured: </span>
                    <strong className="text-white">{wizardData.teams.length} teams</strong> ({wizardData.teams.map(t => t.name).join(', ')})
                  </div>
                  <div>
                    <span className="text-slate-400">Milestones: </span>
                    <strong className="text-white">{wizardData.milestones.length} milestones agreed</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Initial Tasks: </span>
                    <span className="text-slate-200">{wizardData.tasks.length} tasks pre-seeded</span>
                  </div>
                </div>

                {/* Commercial & Payment */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">Commercial Terms</span>
                    <button type="button" onClick={() => setCurrentStep(6)} className="text-blue-400 hover:underline text-[11px]">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Contract Value: </span>
                    <strong className="text-emerald-400 text-sm">${wizardData.payments.totalValue.toLocaleString()} {wizardData.payments.currency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Payment Milestones: </span>
                    <strong className="text-white">{wizardData.payments.paymentMilestones.length} tranches (100% scheduled)</strong>
                  </div>
                </div>

                {/* Governance & SLA */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">Governance SLA</span>
                    <button type="button" onClick={() => setCurrentStep(5)} className="text-blue-400 hover:underline text-[11px]">Edit</button>
                  </div>
                  <div>
                    <span className="text-slate-400">Client Review Window: </span>
                    <strong className="text-white">{wizardData.terms.reviewPeriodDays} Business Days</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Delay Rule: </span>
                    <span className="text-slate-300">Verified Client Delay shifts deadline day-for-day</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Responsibilities: </span>
                    <strong className="text-white">{wizardData.responsibilities.length} contractual obligations</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: ACTIVATION & SUCCESS */}
          {currentStep === 9 && (
            <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Sparkles size={32} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Project Initiated Successfully!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The Terms & Conditions baseline agreement for <strong>"{createdResult?.title || wizardData.basicInfo.title}"</strong> has been transmitted to Client <strong>{createdResult?.clientName || wizardData.client.name}</strong> for formal review.
                </p>
              </div>

              {/* Status Chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
                <Clock size={14} className="text-blue-400" />
                <span>Status: AGREEMENT_PENDING (Awaiting Client Sign-Off)</span>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract Value:</span>
                  <span className="font-bold text-emerald-400">${wizardData.payments.totalValue.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Deadline:</span>
                  <span className="text-white font-mono">{wizardData.basicInfo.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Teams Activated:</span>
                  <span className="text-white font-bold">{wizardData.teams.length} Teams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Step:</span>
                  <span className="text-blue-400 font-semibold">Client approves agreement → Baseline Locks → Task execution begins</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateProjectOpen(false);
                    if (createdResult?.projectId) {
                      setDrilldownProject(createdResult.projectId);
                    }
                    setActiveView('Overview');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                >
                  <span>Go to Project Overview</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateProjectOpen(false);
                    if (createdResult?.projectId) {
                      setDrilldownProject(createdResult.projectId);
                    }
                    setActiveView('Agreement');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all"
                >
                  View Agreement Hub
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 9 && (
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-600'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft size={15} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                Save Draft
              </button>

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(8, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Continue</span>
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                >
                  <Send size={14} />
                  <span>Send to Client for Review</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
