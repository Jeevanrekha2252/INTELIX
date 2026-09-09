import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  ChevronDown,
  Activity,
  Globe,
  GitMerge
} from 'lucide-react';
import { useProject, ROLES } from '../context/ProjectContext';

export default function LoginPageView() {
  const { loginAsRole, setAppMode, showToast } = useProject();

  const [email, setEmail] = useState('ishaan.mantri@intelix.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemoRole, setSelectedDemoRole] = useState('manager');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginAsRole(selectedDemoRole);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F4F7FF] flex flex-col lg:flex-row antialiased relative selection:bg-[#4F7CFF]/30">
      {/* Background Technical Grid */}
      <div className="fixed inset-0 grid-bg opacity-75 pointer-events-none z-0" />

      {/* LEFT PANEL: 55% Enterprise Command Center Telemetry */}
      <div className="relative z-10 lg:w-[55%] p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#252A3A] bg-gradient-to-br from-[#080A12] via-[#0D101A] to-[#131522] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 intelix-glow pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 intelix-glow-violet pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#7C5CFF] text-white font-black grid place-items-center text-base shadow-lg shadow-[#4F7CFF]/30">
              IX
            </div>
            <div>
              <span className="font-black text-xl tracking-tight flex items-center gap-1.5">
                INTELIX
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#171A2A] text-[#39D9FF] border border-[#252A3A] font-mono">
                  COMMAND
                </span>
              </span>
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">
                PROJECT EXECUTION INTELLIGENCE
              </div>
            </div>
          </div>

          <button
            onClick={() => setAppMode('landing')}
            className="flex items-center gap-1.5 text-xs text-[#8992A8] hover:text-[#F4F7FF] transition bg-[#131522] px-3 py-1.5 rounded-lg border border-[#252A3A]"
          >
            <Globe size={13} className="text-[#39D9FF]" />
            <span>Public Website</span>
          </button>
        </div>

        {/* Center Mission Statement */}
        <div className="my-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A2A] border border-[#252A3A] text-[11px] font-mono text-[#39D9FF] mb-4">
            <Activity size={13} className="text-[#18C997]" />
            <span>AUTONOMOUS RISK RADAR READY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F4F7FF] uppercase leading-tight">
            KNOW WHAT'S AT RISK <br />
            <span className="bg-gradient-to-r from-[#4F7CFF] via-[#7C5CFF] to-[#39D9FF] bg-clip-text text-transparent">
              BEFORE IT BECOMES A DELAY.
            </span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#8992A8] leading-relaxed">
            Continuous execution intelligence layer monitoring progress, dependencies, workload, and blocker telemetry.
          </p>

          {/* Floating Live Telemetry Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#131522]/90 border border-[#252A3A] shadow-md">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">PROJECT HEALTH</div>
              <div className="text-2xl font-black text-[#F4F7FF] font-mono mt-0.5">84<span className="text-xs text-[#8992A8]">/100</span></div>
              <div className="text-[10px] text-[#18C997] font-semibold mt-0.5">● Stable Index</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131522]/90 border border-[#252A3A] shadow-md">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">DELIVERY</div>
              <div className="text-lg font-bold text-[#18C997] font-mono mt-1">ON TRACK</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Sprint 4 Active</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131522]/90 border border-[#252A3A] shadow-md">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">RISK LEVEL</div>
              <div className="text-lg font-bold text-[#39D9FF] font-mono mt-1">LOW</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Mitigations Applied</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131522]/90 border border-[#252A3A] shadow-md">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">FORECAST</div>
              <div className="text-lg font-bold text-[#F4F7FF] font-mono mt-1">18 SEP</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Target Release</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131522]/90 border border-[#252A3A] shadow-md col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">DEPENDENCIES</div>
              <div className="text-2xl font-black text-[#7C5CFF] font-mono mt-0.5">12</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Monitored Paths</div>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="text-[11px] text-[#555E73] flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#18C997]" />
          <span>FIPS 140-3 Compliant · SIH26103 National Monitoring Stack</span>
        </div>
      </div>

      {/* RIGHT PANEL: 45% Unified Authentication & Demo Workspace Selector */}
      <div className="relative z-10 lg:w-[45%] p-8 lg:p-16 flex flex-col justify-center bg-[#080A12]">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight">
              Welcome back.
            </h1>
            <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
              Sign in to your intelligence workspace.
            </p>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-tech text-[#8992A8] block mb-1.5">
                ORGANIZATIONAL EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@organization.gov.in"
                  className="w-full px-3.5 py-2.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF] focus:border-[#4F7CFF] transition"
                />
                <Mail size={14} className="absolute right-3.5 top-3 text-[#555E73]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-tech text-[#8992A8]">
                  PASSWORD
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password reset instructions sent to registered organizational address', 'info');
                  }}
                  className="text-[11px] text-[#4F7CFF] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0D101A] border border-[#252A3A] rounded-xl text-xs text-[#F4F7FF] focus:border-[#4F7CFF] transition font-mono"
                />
                <Lock size={14} className="absolute right-3.5 top-3 text-[#555E73]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#8992A8] hover:text-[#F4F7FF]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#252A3A] bg-[#0D101A]"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing In to Intelligence Workspace...</span>
              ) : (
                <>
                  <span>Sign In →</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#252A3A]" />
            </div>
            <span className="relative px-3 bg-[#080A12] text-[11px] font-mono text-[#8992A8] uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* DEMO WORKSPACE EVALUATOR */}
          <div className="p-5 rounded-2xl bg-[#0D101A] border border-[#7C5CFF]/35 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7C5CFF] animate-pulse" />
                <span className="label-tech text-[#39D9FF]">DEMO WORKSPACE</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#AE9AFF] px-2 py-0.5 rounded bg-[#7C5CFF]/15 border border-[#7C5CFF]/30">
                EVALUATOR & JURY
              </span>
            </div>

            <p className="text-xs text-[#8992A8] mb-3">
              Select a role to explore Intelix:
            </p>

            {/* Role Buttons: [ Manager ] [ Developer ] [ Client ] [ Executive ] [ Admin ] */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3.5">
              {ROLES.map((r) => {
                const isSelected = selectedDemoRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedDemoRole(r.id);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#4F7CFF]/15 border-[#4F7CFF] text-[#F4F7FF] shadow-[0_0_12px_rgba(79,124,255,0.25)]'
                        : 'bg-[#131522] border-[#252A3A] text-[#8992A8] hover:text-[#F4F7FF] hover:border-[#384158]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono">[{r.badge}]</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#39D9FF]" />}
                    </div>
                    <div className="text-[10px] text-[#555E73] truncate mt-0.5">{r.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Indicator */}
            {(() => {
              const matched = ROLES.find(r => r.id === selectedDemoRole) || ROLES[0];
              return (
                <div className="mb-3.5 p-2.5 rounded-xl bg-[#131522] border border-[#252A3A] flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-[#F4F7FF] flex items-center gap-1.5">
                      <span>{matched.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#080A12] text-[#39D9FF] font-mono">
                        {matched.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8992A8] truncate mt-0.5">
                      Opens: <span className="text-[#39D9FF] font-semibold">{matched.dashboardTitle}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-[#18C997] bg-[#18C997]/10 px-2 py-0.5 rounded border border-[#18C997]/30 shrink-0">
                    Ready
                  </div>
                </div>
              );
            })()}

            {/* ENTER INTELIX Button */}
            <button
              type="button"
              onClick={() => loginAsRole(selectedDemoRole)}
              className="btn-violet w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition"
            >
              <span>ENTER INTELIX →</span>
            </button>

            <p className="text-[10px] text-[#555E73] text-center mt-2.5 font-mono">
              Role is locked for the entire session upon entry.
            </p>
          </div>

          {/* Learn More / Public Landing Page Link */}
          <div className="mt-6 text-center text-xs text-[#555E73]">
            Want to review the platform overview first?{' '}
            <button
              type="button"
              onClick={() => setAppMode('landing')}
              className="text-[#4F7CFF] hover:underline font-semibold ml-1"
            >
              Learn More About Intelix →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
