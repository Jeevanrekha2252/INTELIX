import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Lock,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Plus,
  RefreshCw,
  Layers,
  TrendingUp,
  History,
  Calendar,
  UserCheck,
  Building,
  HelpCircle,
  FileText,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Sliders,
  ShieldAlert,
  Edit3,
  Scale
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import api from '../services/api';

export default function AgreementView() {
  const {
    currentProject,
    projects,
    selectProject,
    activeRole,
    getAgreementForProject,
    saveProjectAgreement,
    submitAgreementToClient,
    reviewAgreement,
    lockAgreement,
    recordPayment,
    requestAgreementAmendment,
    reviewAgreementAmendment,
    showToast
  } = useProject();

  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scope'); // scope, milestones, payments, responsibilities, variance, amendments
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState('APPROVE'); // APPROVE or REQUEST_CHANGES
  const [reviewNotes, setReviewNotes] = useState('');

  // Simulator state
  const [simulatedProgress, setSimulatedProgress] = useState(68);

  const roleId = activeRole?.id || 'manager';
  const isManager = roleId === 'manager';
  const isClient = roleId === 'client';
  const isAdmin = roleId === 'admin' || roleId === 'exec';
  const isDev = roleId === 'dev';

  const projectId = currentProject?.id || (projects && projects[0]?.id) || 1;

  // Wizard Form State
  const [wizardData, setWizardData] = useState({
    totalValue: 10000,
    currency: 'USD',
    baselineStartDate: '2026-08-01',
    baselineEndDate: '2026-09-30',
    currentForecastEndDate: '2026-10-04',
    verifiedBlockingDelayDays: 4,
    delayAttribution: 'Client dependency: API keys delayed by 4 business days',
    reviewPeriodDays: 5,
    approvalPeriodDays: 3,
    scopeObjective: 'Deliver an enterprise Smart Campus & IoT Telemetry Network platform with automated billing and access control.',
    includedModules: '• RFID Access Gateways\n• TimescaleDB Telemetry Broker\n• Student & Faculty Smart Portal\n• Automated Payment Gateway\n• Real-Time Monitoring & Alerts',
    excludedModules: '• Custom hardware fabrication\n• Legacy ERP database cleansing beyond schema\n• Physical wiring and solar installations',
    assumptions: '• Client provides active AWS staging credentials on Day 1\n• PostgreSQL 15+ instance with 32GB RAM provisioned\n• Client reviews returned within 5 business day SLA',
    agreedDeliverables: '1. Architecture Specification & Swagger Contract\n2. Reactive Web Dashboard with Sub-Second Streaming\n3. Ingestion Gateway with 99.9% Uptime SLA\n4. Deployment Runbook & User Training Manual',
    milestones: [],
    paymentSchedule: [],
    responsibilities: []
  });

  // Amendment Form State
  const [amendmentForm, setAmendmentForm] = useState({
    title: '',
    changeCategory: 'SCOPE',
    fieldName: 'Project Scope Boundary',
    oldValue: '',
    newValue: '',
    reason: ''
  });

  useEffect(() => {
    if (projectId) {
      loadAgreementData(projectId);
    }
  }, [projectId]);

  const loadAgreementData = async (pId) => {
    try {
      setLoading(true);
      // Try backend API first
      let data = null;
      try {
        const res = await api.getProjectAgreement(pId);
        if (res && res.data) {
          data = res.data;
        } else if (res && res.id) {
          data = res;
        }
      } catch (backendErr) {
        // Fallback to local context store
        if (getAgreementForProject) {
          data = getAgreementForProject(pId);
        }
      }

      if (data) {
        setAgreement(data);
        // Prepopulate wizard
        setWizardData({
          totalValue: data.totalValue || 10000,
          currency: data.currency || 'USD',
          baselineStartDate: data.baselineStartDate || '2026-08-01',
          baselineEndDate: data.baselineEndDate || '2026-09-30',
          currentForecastEndDate: data.currentForecastEndDate || data.baselineEndDate || '2026-10-04',
          verifiedBlockingDelayDays: data.verifiedBlockingDelayDays || 0,
          delayAttribution: data.delayAttribution || '',
          reviewPeriodDays: data.reviewPeriodDays || 5,
          approvalPeriodDays: data.approvalPeriodDays || 3,
          scopeObjective: data.scopeObjective || '',
          includedModules: data.includedModules || '',
          excludedModules: data.excludedModules || '',
          assumptions: data.assumptions || '',
          agreedDeliverables: data.agreedDeliverables || '',
          milestones: data.milestones ? JSON.parse(JSON.stringify(data.milestones)) : [],
          paymentSchedule: data.paymentMilestones ? JSON.parse(JSON.stringify(data.paymentMilestones)) : [],
          responsibilities: data.responsibilities ? JSON.parse(JSON.stringify(data.responsibilities)) : []
        });
      } else if (getAgreementForProject) {
        const localData = getAgreementForProject(pId);
        setAgreement(localData);
      }
    } catch (err) {
      console.error('Error loading agreement:', err);
    } finally {
      setLoading(false);
    }
  };

  // DEVELOPER RESTRICTION (Section 3 & 14 & 15)
  if (isDev) {
    return (
      <div className="p-8 max-w-3xl mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 grid place-items-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Confidential Commercial Baseline Restriction
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          In strict compliance with <strong>Project Governance & Terms RBAC policies</strong>, full Commercial Terms, Contract Values, Payment Schedules, and Client Financial Negotiations are restricted to Project Managers, Clients, and Administrators.
        </p>
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="text-slate-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Information Available to Engineering:
          </div>
          <ul className="text-slate-400 space-y-1 list-disc list-inside">
            <li>Assigned Technical Tasks & Deadlines</li>
            <li>Milestone Deliverables & Acceptance Criteria</li>
            <li>Dependency Graph & Blocker Clearances</li>
            <li>Sprint Velocity & Quality Metrics</li>
          </ul>
        </div>
      </div>
    );
  }

  // Action Handlers
  const handleSaveWizard = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (saveProjectAgreement) {
        const updated = await saveProjectAgreement(projectId, wizardData);
        setAgreement(updated);
      } else {
        await api.createOrUpdateAgreement(projectId, wizardData);
        await loadAgreementData(projectId);
      }
      setIsWizardOpen(false);
      showToast('Project Agreement draft baseline successfully configured!', 'success');
    } catch (err) {
      alert('Error saving agreement: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitToClient = async () => {
    if (!agreement?.id) return;
    try {
      setActionLoading(true);
      if (submitAgreementToClient) {
        await submitAgreementToClient(agreement.id);
      } else {
        await api.submitAgreementToClient(agreement.id);
      }
      await loadAgreementData(projectId);
      showToast('Baseline Agreement submitted to Client for formal review!', 'success');
    } catch (err) {
      alert('Error submitting agreement: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewAgreement = async () => {
    if (!agreement?.id) return;
    try {
      setActionLoading(true);
      if (reviewAgreement) {
        await reviewAgreement(agreement.id, {
          decision: reviewAction,
          comments: reviewNotes
        });
      } else {
        await api.reviewAgreement(agreement.id, {
          action: reviewAction,
          reviewNotes: reviewNotes
        });
      }
      setShowReviewModal(false);
      setReviewNotes('');
      await loadAgreementData(projectId);
      showToast(
        reviewAction === 'APPROVE'
          ? 'Agreement Approved! Ready for Manager to Lock & Activate.'
          : 'Revisions requested. Notification sent to Manager.',
        'success'
      );
    } catch (err) {
      alert('Error reviewing agreement: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLockAgreement = async () => {
    if (!agreement?.id) return;
    try {
      setActionLoading(true);
      if (lockAgreement) {
        await lockAgreement(agreement.id);
      } else {
        await api.lockAndActivateAgreement(agreement.id);
      }
      await loadAgreementData(projectId);
      showToast('Agreement LOCKED & SEALED! Project is officially ACTIVE for execution.', 'success');
    } catch (err) {
      alert('Error locking agreement: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async (paymentId) => {
    try {
      setActionLoading(true);
      if (recordPayment) {
        await recordPayment(paymentId);
      } else {
        await api.recordPayment(paymentId, { transactionRef: `TXN-${Date.now()}` });
      }
      await loadAgreementData(projectId);
      showToast('Payment confirmed and recorded in financial audit ledger!', 'success');
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAmendment = async (e) => {
    e.preventDefault();
    if (!agreement?.id) return;
    try {
      setActionLoading(true);
      if (requestAgreementAmendment) {
        await requestAgreementAmendment(agreement.id, amendmentForm);
      } else {
        await api.requestAgreementAmendment(agreement.id, amendmentForm);
      }
      setIsAmendmentModalOpen(false);
      setAmendmentForm({
        title: '',
        changeCategory: 'SCOPE',
        fieldName: 'Project Scope Boundary',
        oldValue: '',
        newValue: '',
        reason: ''
      });
      await loadAgreementData(projectId);
      showToast('Baseline amendment request logged for counterparty review!', 'success');
    } catch (err) {
      alert('Error requesting amendment: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewAmendment = async (amendmentId, approved, notes = '') => {
    try {
      setActionLoading(true);
      if (reviewAgreementAmendment) {
        await reviewAgreementAmendment(amendmentId, { approved, reviewNotes: notes });
      } else {
        await api.reviewAgreementAmendment(amendmentId, { approved, reviewNotes: notes });
      }
      await loadAgreementData(projectId);
      showToast(
        approved
          ? 'Amendment approved! Baseline version updated and merged into ledger.'
          : 'Amendment rejected.',
        'info'
      );
    } catch (err) {
      alert('Error reviewing amendment: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#4F7CFF] mb-3" />
        <p className="text-sm font-medium">Loading Project Initiation Governance & Baseline Agreement...</p>
      </div>
    );
  }

  // Calculate dynamic metrics (Section 13)
  const totalValue = agreement?.totalValue || 10000;
  const currency = agreement?.currency || 'USD';
  const paymentMilestones = agreement?.paymentMilestones || [];
  const paidAmount = paymentMilestones
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
  const paymentPct = totalValue > 0 ? Math.round((paidAmount / totalValue) * 100) : 0;
  const nextPayment = paymentMilestones.find(p => p.status === 'PENDING' || p.status === 'TRIGGERED');

  const clientRespCount = agreement?.responsibilities?.filter(r => r.ownerRole === 'CLIENT')?.length || 0;
  const managerRespCount = agreement?.responsibilities?.filter(r => r.ownerRole === 'MANAGER')?.length || 0;
  const teamRespCount = agreement?.responsibilities?.filter(r => r.ownerRole === 'DEVELOPER' || r.ownerRole === 'TEAM')?.length || 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LOCKED':
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#18C997]/15 text-[#18C997] border border-[#18C997]/30 shadow-sm">
            <Lock className="w-3.5 h-3.5" /> ACTIVE & LOCKED BASELINE
          </span>
        );
      case 'CLIENT_APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#39D9FF]/15 text-[#39D9FF] border border-[#39D9FF]/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> CLIENT APPROVED (AWAITING LOCK)
          </span>
        );
      case 'SENT_TO_CLIENT':
      case 'CLIENT_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> SENT TO CLIENT · REVIEW IN PROGRESS
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30">
            <AlertTriangle className="w-3.5 h-3.5" /> CHANGES REQUESTED BY CLIENT
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <FileText className="w-3.5 h-3.5" /> PRE-EXECUTION DRAFT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0D101A] via-[#131522] to-[#0D101A] border border-[#252A3A] rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {getStatusBadge(agreement?.status || 'DRAFT')}
              <span className="text-xs font-mono px-2.5 py-1 bg-[#171A2A] rounded-md text-[#8992A8] border border-[#252A3A]">
                Baseline v{agreement?.version || 1}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#4F7CFF]/15 text-[#8EB0FF] border border-[#4F7CFF]/30 font-mono">
                {agreement?.projectName || currentProject?.name || 'Smart Campus 360'}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#F4F7FF] tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#4F7CFF]" />
              Project Initiation Agreement & Governance Baseline
            </h1>
            <p className="text-[#8992A8] text-xs lg:text-sm mt-1.5 max-w-3xl leading-relaxed">
              Established <strong>BEFORE execution begins</strong>. Controls scope boundaries, agreed milestones, commercial triggers, stakeholder responsibilities, and delay attribution.
            </p>
          </div>

          {/* Role Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isManager && (agreement?.status === 'DRAFT' || agreement?.status === 'CHANGES_REQUESTED') && (
              <>
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#171A2A] hover:bg-[#202538] text-[#F4F7FF] border border-[#252A3A] hover:border-[#4F7CFF]/40 rounded-xl text-xs font-bold transition"
                >
                  <Edit3 className="w-4 h-4 text-[#39D9FF]" />
                  Configure Terms Wizard
                </button>
                <button
                  onClick={handleSubmitToClient}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#4F7CFF] hover:bg-[#3D68E5] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#4F7CFF]/25"
                >
                  <Send className="w-4 h-4" />
                  Submit to Client for Review
                </button>
              </>
            )}

            {isClient && (agreement?.status === 'SENT_TO_CLIENT' || agreement?.status === 'CLIENT_REVIEW') && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReviewAction('APPROVE');
                    setShowReviewModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#18C997] hover:bg-[#15B084] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#18C997]/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Agreement
                </button>
                <button
                  onClick={() => {
                    setReviewAction('REQUEST_CHANGES');
                    setShowReviewModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF4D6D]/90 hover:bg-[#FF4D6D] text-white rounded-xl text-xs font-bold transition"
                >
                  <XCircle className="w-4 h-4" />
                  Request Changes
                </button>
              </div>
            )}

            {isManager && agreement?.status === 'CLIENT_APPROVED' && (
              <button
                onClick={handleLockAgreement}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#18C997] to-[#11998e] hover:from-[#15B084] hover:to-[#0e8077] text-white rounded-xl text-xs font-bold transition shadow-xl shadow-[#18C997]/20"
              >
                <Lock className="w-4 h-4" />
                Lock Baseline & Activate Project
              </button>
            )}

            {(isManager || isClient || isAdmin) && (agreement?.status === 'LOCKED' || agreement?.status === 'ACTIVE') && (
              <button
                onClick={() => setIsAmendmentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#171A2A] hover:bg-[#202538] text-[#F4F7FF] border border-[#252A3A] hover:border-[#7C5CFF]/40 rounded-xl text-xs font-bold transition"
              >
                <Plus className="w-4 h-4 text-[#AE9AFF]" />
                Request Baseline Amendment
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics Strip (Section 13: Project Agreement Dashboard) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-7 pt-6 border-t border-[#252A3A]">
          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-[#18C997]" /> PROJECT VALUE
            </span>
            <div className="text-lg font-black text-white">
              ${totalValue.toLocaleString()} <span className="text-[10px] text-[#555E73] font-normal">{currency}</span>
            </div>
            <div className="text-[10px] text-[#8992A8] mt-0.5">
              Fixed Baseline Contract
            </div>
          </div>

          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#39D9FF]" /> PAYMENT PROGRESS
            </span>
            <div className="text-lg font-black text-white">
              ${paidAmount.toLocaleString()} <span className="text-xs text-[#8992A8] font-normal">({paymentPct}%)</span>
            </div>
            <div className="w-full bg-[#171A2A] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#4F7CFF] h-full rounded-full transition-all duration-500"
                style={{ width: `${paymentPct}%` }}
              />
            </div>
          </div>

          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#F5B942]" /> NEXT PAYMENT
            </span>
            <div className="text-sm font-bold text-white truncate">
              {nextPayment ? `$${nextPayment.paymentAmount?.toLocaleString()}` : 'Settled in Full'}
            </div>
            <div className="text-[10px] text-[#F5B942] mt-0.5 truncate">
              {nextPayment ? `Trigger: ${nextPayment.triggerValue || 80}% / ${nextPayment.title}` : 'All Tranches Paid'}
            </div>
          </div>

          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#8EB0FF]" /> BASELINE DEADLINE
            </span>
            <div className="text-sm font-bold text-white">
              {agreement?.baselineEndDate || '30 Sep 2026'}
            </div>
            <div className="text-[10px] text-[#8992A8] mt-0.5 flex items-center gap-1">
              Forecast: <span className="text-[#F5B942] font-semibold">{agreement?.currentForecastEndDate || '04 Oct 2026'}</span>
            </div>
          </div>

          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D6D]" /> DELAY ATTRIBUTION
            </span>
            <div className="text-sm font-bold text-[#FF859B]">
              +{agreement?.verifiedBlockingDelayDays || 4} days
            </div>
            <div className="text-[10px] text-[#8992A8] mt-0.5 truncate" title={agreement?.delayAttribution}>
              Client Dependency Blocking
            </div>
          </div>

          <div className="bg-[#080A12]/80 p-3.5 rounded-2xl border border-[#252A3A]">
            <span className="text-[11px] text-[#8992A8] font-medium flex items-center gap-1.5 mb-1">
              <History className="w-3.5 h-3.5 text-[#AE9AFF]" /> AMENDMENTS
            </span>
            <div className="text-lg font-black text-white">
              {agreement?.amendments?.length || 2} <span className="text-[10px] text-[#555E73] font-normal">logged</span>
            </div>
            <div className="text-[10px] text-[#18C997] mt-0.5">
              {agreement?.amendments?.filter(a => a.status === 'APPROVED')?.length || 2} Approved Baseline
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#252A3A] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scope')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'scope'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <Layers className="w-4 h-4" /> Scope & Objectives (A)
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'milestones'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <FileCheck2 className="w-4 h-4" /> Milestones & Acceptance (B) ({agreement?.milestones?.length || 4})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'payments'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Payment Terms & Triggers (C) ({paymentMilestones.length || 4})
        </button>

        <button
          onClick={() => setActiveTab('responsibilities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'responsibilities'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Responsibilities Matrix (D) ({clientRespCount + managerRespCount + teamRespCount || 13})
        </button>

        <button
          onClick={() => setActiveTab('variance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'variance'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <Scale className="w-4 h-4" /> Delay Terms & Baseline Variance (E)
        </button>

        <button
          onClick={() => setActiveTab('amendments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'amendments'
              ? 'bg-[#4F7CFF]/15 text-[#39D9FF] border border-[#4F7CFF]/35'
              : 'text-[#8992A8] hover:text-[#F4F7FF] hover:bg-[#131522]'
          }`}
        >
          <History className="w-4 h-4" /> Amendments Ledger ({agreement?.amendments?.length || 2})
        </button>
      </div>

      {/* TAB 1: SCOPE & OBJECTIVES */}
      {activeTab === 'scope' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4F7CFF]" /> Project Objective
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line bg-[#080A12] p-4 rounded-xl border border-[#252A3A]">
                {agreement?.scopeObjective || 'Deliver an enterprise Smart Campus & IoT Telemetry Network platform with automated billing and access control.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#18C997] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Included Modules
                </h3>
                <div className="text-slate-300 text-xs whitespace-pre-line bg-[#080A12] p-4 rounded-xl border border-[#252A3A] leading-relaxed">
                  {agreement?.includedModules || '• RFID Access Gateways\n• TimescaleDB Telemetry Broker\n• Student & Faculty Smart Portal\n• Automated Payment Gateway\n• Real-Time Monitoring & Alerts'}
                </div>
              </div>

              <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#FF4D6D] mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Excluded Modules & Boundaries
                </h3>
                <div className="text-slate-300 text-xs whitespace-pre-line bg-[#080A12] p-4 rounded-xl border border-[#252A3A] leading-relaxed">
                  {agreement?.excludedModules || '• Custom hardware fabrication\n• Legacy ERP database cleansing beyond schema\n• Physical wiring and solar installations'}
                </div>
              </div>
            </div>

            <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#F5B942] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Agreed Deliverables & Acceptance Baseline
              </h3>
              <div className="text-slate-300 text-xs whitespace-pre-line bg-[#080A12] p-4 rounded-xl border border-[#252A3A] leading-relaxed">
                {agreement?.agreedDeliverables || '1. Architecture Specification & Swagger Contract\n2. Reactive Web Dashboard with Sub-Second Streaming\n3. Ingestion Gateway with 99.9% Uptime SLA\n4. Deployment Runbook & User Training Manual'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#171A2A] to-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#39D9FF]" /> Governance Windows
              </h3>
              <p className="text-[#8992A8] text-xs leading-relaxed mb-3">
                Pre-agreed SLA windows for stakeholder reviews and milestone approvals.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#080A12] border border-[#252A3A]">
                  <span className="text-[#8992A8]">Client Review Window:</span>
                  <span className="font-bold text-white">{agreement?.reviewPeriodDays || 5} business days</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#080A12] border border-[#252A3A]">
                  <span className="text-[#8992A8]">Approval Window:</span>
                  <span className="font-bold text-white">{agreement?.approvalPeriodDays || 3} business days</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#080A12] border border-[#252A3A]">
                  <span className="text-[#8992A8]">Signatory Authority:</span>
                  <span className="font-bold text-[#18C997]">{agreement?.approvedByClientName || 'Client Council'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#18C997]" /> Project Baseline Assumptions
              </h3>
              <div className="text-slate-300 text-xs whitespace-pre-line leading-relaxed bg-[#080A12] p-3.5 rounded-xl border border-[#252A3A]">
                {agreement?.assumptions || '• Client provides active AWS staging credentials on Day 1\n• PostgreSQL 15+ instance with 32GB RAM provisioned\n• Client reviews returned within 5 business day SLA'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES & ACCEPTANCE */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agreement?.milestones?.map((m, idx) => (
              <div key={m.id || idx} className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5 hover:border-[#4F7CFF]/40 transition">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#39D9FF] uppercase tracking-wider font-bold">
                      Milestone {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{m.name || m.title}</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-[#171A2A] text-slate-300 border border-[#252A3A] rounded-lg flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3 h-3 text-[#4F7CFF]" />
                    {m.targetDate || '2026-09-30'}
                  </span>
                </div>

                <p className="text-[#8992A8] text-xs mb-3.5">{m.description}</p>

                <div className="space-y-2.5 text-xs bg-[#080A12] p-3.5 rounded-xl border border-[#252A3A]">
                  <div>
                    <span className="text-[#555E73] font-medium block">Deliverable:</span>
                    <p className="text-slate-300 font-medium mt-0.5">{m.deliverables || 'Specification docs & integration endpoints'}</p>
                  </div>
                  <div>
                    <span className="text-[#555E73] font-medium block">Completion Requirement:</span>
                    <p className="text-slate-300 font-medium mt-0.5">{m.completionRequirement || 'Passes unit and integration test suites (>85% coverage)'}</p>
                  </div>
                  <div>
                    <span className="text-[#555E73] font-medium block">Acceptance Criteria:</span>
                    <p className="text-[#18C997] font-semibold mt-0.5">{m.acceptanceCriteria || 'Client sign-off and latency benchmark verified <50ms'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT TERMS & TRIGGERS */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#18C997]/10 via-[#0D101A] to-[#0D101A] border border-[#18C997]/25 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#18C997]" /> Pre-Established Commercial Payment Schedule
              </h3>
              <p className="text-xs text-[#8992A8] mt-0.5">
                Total Baseline Contract: <span className="text-[#18C997] font-bold">${totalValue.toLocaleString()} {currency}</span>. Payments trigger automatically upon verified milestone threshold achievement.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8992A8]">Total Settled:</span>
              <div className="text-lg font-black text-[#18C997]">${paidAmount.toLocaleString()} / ${totalValue.toLocaleString()}</div>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#0D101A] border border-[#252A3A] rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#252A3A] font-bold text-[#8992A8] uppercase tracking-wider bg-[#080A12]">
                  <th className="py-3 px-4">Tranche / Milestone</th>
                  <th className="py-3 px-4">Trigger Condition</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A3A]/60">
                {paymentMilestones.map((pm, idx) => (
                  <tr key={pm.id || idx} className="hover:bg-[#131522]/50 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {pm.title || pm.name || `Milestone ${idx + 1}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {pm.triggerType === 'PERCENTAGE'
                        ? `${pm.triggerValue || 20}% Project Progress`
                        : `Milestone ${pm.triggerValue || idx + 1} Acceptance`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {pm.paymentPercentage}%
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#18C997]">
                      ${pm.paymentAmount?.toLocaleString()} {currency}
                    </td>
                    <td className="py-3.5 px-4">
                      {pm.status === 'PAID' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#18C997] bg-[#18C997]/15 px-2.5 py-0.5 rounded-full border border-[#18C997]/30">
                          <CheckCircle2 className="w-3 h-3" /> PAID
                        </span>
                      )}
                      {pm.status === 'TRIGGERED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F5B942] bg-[#F5B942]/15 px-2.5 py-0.5 rounded-full border border-[#F5B942]/30 animate-pulse">
                          <Clock className="w-3 h-3" /> TRIGGERED / DUE
                        </span>
                      )}
                      {pm.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8992A8] bg-[#171A2A] px-2.5 py-0.5 rounded-full border border-[#252A3A]">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {(isManager || isClient || isAdmin) && pm.status === 'TRIGGERED' && (
                        <button
                          onClick={() => handleRecordPayment(pm.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-[#18C997] hover:bg-[#15B084] text-white rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          Record Settlement
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RESPONSIBILITIES MATRIX */}
      {activeTab === 'responsibilities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Client Responsibilities */}
          <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#252A3A]">
              <h4 className="text-xs font-bold text-[#39D9FF] flex items-center gap-2">
                <Building className="w-4 h-4" /> Client Responsibilities ({clientRespCount})
              </h4>
              <span className="text-[10px] px-2 py-0.5 bg-[#39D9FF]/15 text-[#39D9FF] rounded font-bold">Stakeholder</span>
            </div>
            <div className="space-y-2.5">
              {agreement?.responsibilities
                ?.filter(r => r.ownerRole === 'CLIENT')
                ?.map((r, idx) => (
                  <div key={r.id || idx} className="p-3 bg-[#080A12] rounded-xl border border-[#252A3A]">
                    <div className="font-bold text-xs text-white">{r.title}</div>
                    <p className="text-[#8992A8] text-[11px] mt-1 leading-relaxed">{r.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#252A3A]/60 text-[10px]">
                      <span className="text-[#555E73]">Due: {r.dueDate || 'Sprint 1'}</span>
                      <span className={`font-bold ${r.status === 'COMPLETED' ? 'text-[#18C997]' : 'text-[#39D9FF]'}`}>
                        {r.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Manager Responsibilities */}
          <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#252A3A]">
              <h4 className="text-xs font-bold text-[#8EB0FF] flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Manager Responsibilities ({managerRespCount})
              </h4>
              <span className="text-[10px] px-2 py-0.5 bg-[#4F7CFF]/15 text-[#8EB0FF] rounded font-bold">PM Authority</span>
            </div>
            <div className="space-y-2.5">
              {agreement?.responsibilities
                ?.filter(r => r.ownerRole === 'MANAGER')
                ?.map((r, idx) => (
                  <div key={r.id || idx} className="p-3 bg-[#080A12] rounded-xl border border-[#252A3A]">
                    <div className="font-bold text-xs text-white">{r.title}</div>
                    <p className="text-[#8992A8] text-[11px] mt-1 leading-relaxed">{r.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#252A3A]/60 text-[10px]">
                      <span className="text-[#555E73]">Due: {r.dueDate || 'Ongoing'}</span>
                      <span className="text-[#4F7CFF] font-bold">{r.status || 'ACTIVE'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Team Responsibilities */}
          <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#252A3A]">
              <h4 className="text-xs font-bold text-[#18C997] flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Engineering Responsibilities ({teamRespCount})
              </h4>
              <span className="text-[10px] px-2 py-0.5 bg-[#18C997]/15 text-[#18C997] rounded font-bold">Technical Team</span>
            </div>
            <div className="space-y-2.5">
              {agreement?.responsibilities
                ?.filter(r => r.ownerRole === 'DEVELOPER' || r.ownerRole === 'TEAM')
                ?.map((r, idx) => (
                  <div key={r.id || idx} className="p-3 bg-[#080A12] rounded-xl border border-[#252A3A]">
                    <div className="font-bold text-xs text-white">{r.title}</div>
                    <p className="text-[#8992A8] text-[11px] mt-1 leading-relaxed">{r.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#252A3A]/60 text-[10px]">
                      <span className="text-[#555E73]">Due: {r.dueDate || 'Sprint Milestones'}</span>
                      <span className="text-[#18C997] font-bold">{r.status || 'IN_PROGRESS'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DELAY TERMS & BASELINE VARIANCE */}
      {activeTab === 'variance' && (
        <div className="space-y-6">
          <div className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#39D9FF]" /> Agreed Baseline Delay Attribution Governance
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed max-w-4xl bg-[#080A12] p-4 rounded-xl border border-[#252A3A]">
              <strong>Rule 6 Contractual Clause:</strong> If a verified external dependency owned by a stakeholder delays execution, the schedule may be adjusted by the verified blocking period. Intelix preserves <strong>BOTH the Original Baseline and Current Adjusted Forecast</strong>. The original baseline deadline is never silently overwritten.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-[#080A12] border border-[#18C997]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18C997] uppercase tracking-wider">Original Agreed Baseline</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#18C997]/15 text-[#18C997] font-mono">LOCKED</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {agreement?.baselineEndDate || '30 Sep 2026'}
                </div>
                <div className="text-xs text-[#8992A8]">
                  Agreed at Project Initiation by Manager and Client Authority.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#080A12] border border-[#F5B942]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5B942] uppercase tracking-wider">Current Forecast / Adjusted Schedule</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#F5B942]/15 text-[#F5B942] font-mono">+4 Days Variance</span>
                </div>
                <div className="text-2xl font-black text-[#F5B942] font-mono">
                  {agreement?.currentForecastEndDate || '04 Oct 2026'}
                </div>
                <div className="text-xs text-[#8992A8]">
                  Attributed Cause: <span className="text-slate-300">{agreement?.delayAttribution || 'Client API credentials delivered 4 days late'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AMENDMENTS LEDGER */}
      {activeTab === 'amendments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#AE9AFF]" /> Formal Baseline Amendments Ledger
              </h3>
              <p className="text-xs text-[#8992A8] mt-0.5">
                Once locked, baseline terms cannot be silently altered. Scope, milestone, or payment adjustments require formal amendment approval.
              </p>
            </div>
            {(isManager || isClient || isAdmin) && (
              <button
                onClick={() => setIsAmendmentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#4F7CFF] hover:bg-[#3D68E5] text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Request Amendment
              </button>
            )}
          </div>

          <div className="space-y-3">
            {agreement?.amendments?.map((a, idx) => (
              <div key={a.id || idx} className="bg-[#0D101A] border border-[#252A3A] rounded-2xl p-5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#252A3A]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#171A2A] text-[#39D9FF] rounded-lg border border-[#252A3A]">
                      Amendment #{a.amendmentNumber || idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">{a.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#4F7CFF]/15 text-[#8EB0FF] rounded font-mono">
                      {a.category || a.changeCategory}
                    </span>
                  </div>

                  <div>
                    {a.status === 'APPROVED' && (
                      <span className="text-xs font-bold text-[#18C997] bg-[#18C997]/15 px-3 py-1 rounded-full border border-[#18C997]/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED & ENACTED
                      </span>
                    )}
                    {a.status === 'REJECTED' && (
                      <span className="text-xs font-bold text-[#FF4D6D] bg-[#FF4D6D]/15 px-3 py-1 rounded-full border border-[#FF4D6D]/30 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> REJECTED
                      </span>
                    )}
                    {a.status === 'REQUESTED' && (
                      <span className="text-xs font-bold text-[#F5B942] bg-[#F5B942]/15 px-3 py-1 rounded-full border border-[#F5B942]/30 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> AWAITING APPROVAL
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#080A12] p-3 rounded-xl border border-[#FF4D6D]/20">
                    <span className="text-[#FF859B] font-bold block mb-1">Original Baseline:</span>
                    <p className="text-slate-300 whitespace-pre-line">{a.oldValue}</p>
                  </div>
                  <div className="bg-[#080A12] p-3 rounded-xl border border-[#18C997]/20">
                    <span className="text-[#18C997] font-bold block mb-1">Proposed Enactment:</span>
                    <p className="text-slate-300 whitespace-pre-line">{a.newValue}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-[#8992A8] pt-2 border-t border-[#252A3A]">
                  <div>
                    <span className="font-bold text-slate-300">Justification:</span> {a.reason}
                  </div>
                  {a.status === 'REQUESTED' && isClient && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewAmendment(a.id, true, 'Approved by Client')}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-[#18C997] hover:bg-[#15B084] text-white rounded-lg font-bold"
                      >
                        Approve Amendment
                      </button>
                      <button
                        onClick={() => handleReviewAmendment(a.id, false, 'Rejected by Client')}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-[#FF4D6D] hover:bg-[#E03A58] text-white rounded-lg font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initiation / Configuration Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <form onSubmit={handleSaveWizard} className="bg-[#0D101A] border border-[#252A3A] rounded-3xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#252A3A] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#4F7CFF]" />
                Project Initiation Agreement Setup Wizard
              </h3>
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="text-[#8992A8] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contract Total Value</label>
                <input
                  type="number"
                  value={wizardData.totalValue}
                  onChange={(e) => setWizardData({ ...wizardData, totalValue: +e.target.value })}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Currency</label>
                <input
                  type="text"
                  value={wizardData.currency}
                  onChange={(e) => setWizardData({ ...wizardData, currency: e.target.value })}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Baseline Deadline</label>
                <input
                  type="date"
                  value={wizardData.baselineEndDate}
                  onChange={(e) => setWizardData({ ...wizardData, baselineEndDate: e.target.value })}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Section A: Scope Objective</label>
              <textarea
                value={wizardData.scopeObjective}
                onChange={(e) => setWizardData({ ...wizardData, scopeObjective: e.target.value })}
                rows={2}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                placeholder="High-level project objective and beneficiary targets..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18C997] mb-1">Included Modules</label>
                <textarea
                  value={wizardData.includedModules}
                  onChange={(e) => setWizardData({ ...wizardData, includedModules: e.target.value })}
                  rows={3}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  placeholder="• Module 1\n• Module 2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#FF4D6D] mb-1">Excluded Modules & Boundaries</label>
                <textarea
                  value={wizardData.excludedModules}
                  onChange={(e) => setWizardData({ ...wizardData, excludedModules: e.target.value })}
                  rows={3}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  placeholder="• Excluded item 1\n• Out of scope boundaries"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F5B942] mb-1">Agreed Deliverables</label>
              <textarea
                value={wizardData.agreedDeliverables}
                onChange={(e) => setWizardData({ ...wizardData, agreedDeliverables: e.target.value })}
                rows={2}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252A3A]">
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#8992A8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2.5 bg-[#4F7CFF] hover:bg-[#3D68E5] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#4F7CFF]/25"
              >
                Save Baseline Draft
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Modal for Client */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D101A] border border-[#252A3A] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {reviewAction === 'APPROVE' ? 'Confirm Baseline Agreement Approval' : 'Request Changes to Agreement'}
            </h3>
            <p className="text-xs text-[#8992A8]">
              {reviewAction === 'APPROVE'
                ? 'By approving, you confirm acceptance of scope boundaries, milestone deliverables, and payment triggers.'
                : 'Specify terms or milestone deadlines that need adjustment before signing.'}
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {reviewAction === 'APPROVE' ? 'Approval Notes (Optional)' : 'Change Request Details *'}
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={reviewAction === 'APPROVE' ? 'Agreed to terms...' : 'Please revise milestone 3 timeline...'}
                rows={3}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252A3A]">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs text-[#8992A8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewAgreement}
                disabled={actionLoading || (reviewAction === 'REQUEST_CHANGES' && !reviewNotes.trim())}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition ${
                  reviewAction === 'APPROVE' ? 'bg-[#18C997] hover:bg-[#15B084]' : 'bg-[#FF4D6D] hover:bg-[#E03A58]'
                }`}
              >
                Confirm {reviewAction === 'APPROVE' ? 'Approval' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amendment Modal */}
      {isAmendmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateAmendment} className="bg-[#0D101A] border border-[#252A3A] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">Request Baseline Amendment</h3>
            <p className="text-xs text-[#8992A8]">
              Baseline terms cannot be edited directly. Submit a formal amendment request for mutual review.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={amendmentForm.changeCategory}
                  onChange={(e) => setAmendmentForm({ ...amendmentForm, changeCategory: e.target.value })}
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  <option value="SCOPE">Scope Change</option>
                  <option value="DEADLINE">Deadline Adjustment</option>
                  <option value="PAYMENT">Payment Terms</option>
                  <option value="MILESTONE">Milestone Requirement</option>
                  <option value="RESPONSIBILITY">Responsibility Boundary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amendment Title</label>
                <input
                  type="text"
                  value={amendmentForm.title}
                  onChange={(e) => setAmendmentForm({ ...amendmentForm, title: e.target.value })}
                  placeholder="e.g. Schedule Compensation for API Delay"
                  className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Baseline Value</label>
              <textarea
                value={amendmentForm.oldValue}
                onChange={(e) => setAmendmentForm({ ...amendmentForm, oldValue: e.target.value })}
                placeholder="e.g. Target Completion: 30 Sep 2026"
                rows={2}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Proposed Enactment</label>
              <textarea
                value={amendmentForm.newValue}
                onChange={(e) => setAmendmentForm({ ...amendmentForm, newValue: e.target.value })}
                placeholder="e.g. Target Completion: 04 Oct 2026 (+4 days blocking extension)"
                rows={2}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Justification / Verified Delay Context</label>
              <textarea
                value={amendmentForm.reason}
                onChange={(e) => setAmendmentForm({ ...amendmentForm, reason: e.target.value })}
                placeholder="e.g. External third-party API credentials delivered 4 days after agreed SLA..."
                rows={2}
                className="w-full bg-[#080A12] border border-[#252A3A] rounded-xl p-2.5 text-xs text-white outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252A3A]">
              <button
                type="button"
                onClick={() => setIsAmendmentModalOpen(false)}
                className="px-4 py-2 text-xs text-[#8992A8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#3D68E5] rounded-xl transition shadow-sm"
              >
                Submit Amendment Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
