import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  TrendingDown,
  CheckCircle2,
  GitMerge,
  Layers,
  Activity,
  ChevronRight,
  Clock,
  AlertTriangle,
  Play,
  Users2,
  BarChart3,
  Server,
  Lock,
  Compass
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function LandingPageView() {
  const { setAppMode, loginAsRole } = useProject();
  const [activeDemoStep, setActiveDemoStep] = useState(2); // interactive step in risk demo

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F4F7FF] selection:bg-[#4F7CFF]/30 selection:text-[#8EB0FF]">
      {/* Technical Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-75 pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] intelix-glow pointer-events-none z-0" />

      {/* Landing Navigation */}
      <header className="relative z-20 border-b border-[#252A3A]/80 bg-[#080A12]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#7C5CFF] text-white font-black grid place-items-center text-sm shadow-md shadow-[#4F7CFF]/30">
              IX
            </div>
            <div>
              <span className="font-black text-xl tracking-tight flex items-center gap-1.5">
                INTELIX
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#131522] text-[#39D9FF] border border-[#252A3A] font-mono">
                  ENTERPRISE
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#8992A8]">
            <a href="#platform" className="hover:text-[#F4F7FF] transition">Platform</a>
            <a href="#how-it-works" className="hover:text-[#F4F7FF] transition">How It Works</a>
            <a href="#demo" className="hover:text-[#F4F7FF] transition">Risk Simulation</a>
            <a href="#roles" className="hover:text-[#F4F7FF] transition">Role Experiences</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAppMode('login')}
              className="btn-ghost px-4 py-2 rounded-xl text-xs font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => loginAsRole('manager')}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Explore Intelligence</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative z-10 pt-20 pb-28 px-6 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131522] border border-[#252A3A] text-xs font-mono text-[#39D9FF] mb-6 shadow-sm">
          <Sparkles size={13} className="text-[#7C5CFF]" />
          <span>PROJECT EXECUTION INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F4F7FF] leading-[1.08] uppercase">
          KNOW WHAT'S AT RISK <br />
          <span className="bg-gradient-to-r from-[#4F7CFF] via-[#7C5CFF] to-[#39D9FF] bg-clip-text text-transparent">
            BEFORE IT BECOMES A DELAY.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-[#8992A8] max-w-3xl mx-auto leading-relaxed">
          Intelix connects project progress, deadlines, dependencies and workload into one intelligent execution layer — detecting emerging risks, forecasting delivery impact and recommending corrective action.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => loginAsRole('manager')}
            className="btn-primary px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <span>EXPLORE INTELLIGENCE</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setAppMode('login')}
            className="btn-secondary px-6 py-3.5 rounded-xl text-sm font-bold"
          >
            REQUEST DEMO
          </button>
        </div>

        {/* Live Miniature System Monitor Preview */}
        <div className="mt-16 surface-card rounded-2xl p-5 border border-[#252A3A] max-w-4xl mx-auto text-left shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252A3A] text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#18C997] animate-ping" />
              <span className="text-[#39D9FF] font-bold uppercase">LIVE SYSTEM TELEMETRY</span>
            </div>
            <span className="text-[#555E73]">SIH26103 DECISION ENGINE ONLINE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">PROJECT HEALTH</div>
              <div className="text-2xl font-black text-[#F4F7FF] font-mono mt-1">84<span className="text-xs text-[#8992A8]">/100</span></div>
              <div className="text-[10px] text-[#18C997] font-semibold mt-0.5">Optimal Index</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">DELIVERY</div>
              <div className="text-xl font-bold text-[#18C997] font-mono mt-1.5">ON TRACK</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Sprint Cycle 4</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">CRITICAL RISK</div>
              <div className="text-xl font-bold text-[#FF859B] font-mono mt-1.5">1 SIGNAL</div>
              <div className="text-[10px] text-[#FF4D6D] mt-0.5">Database Contention</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A]">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">FORECAST</div>
              <div className="text-xl font-bold text-[#F4F7FF] font-mono mt-1.5">18 SEP</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">91% Confidence</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D101A] border border-[#252A3A] col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[#8992A8] font-mono uppercase">DEPENDENCIES</div>
              <div className="text-2xl font-black text-[#39D9FF] font-mono mt-1">12</div>
              <div className="text-[10px] text-[#8992A8] mt-0.5">Active Links</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY INTELIX */}
      <section id="platform" className="relative z-10 py-20 px-6 border-t border-[#252A3A] bg-[#0D101A]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="label-tech text-[#39D9FF] mb-2">PARADIGM SHIFT</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7FF] tracking-tight uppercase">
              PROJECT MANAGEMENT TELLS YOU <br />
              <span className="text-[#8992A8]">WHAT HAPPENED.</span> <br />
              INTELIX TELLS YOU <br />
              <span className="text-[#4F7CFF]">WHAT HAPPENS NEXT.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Card */}
            <div className="surface-card rounded-2xl p-7 border border-[#252A3A]">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#252A3A]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#555E73]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#8992A8]">Traditional Tools (Jira / Spreadsheets)</span>
              </div>
              <div className="space-y-4">
                {[
                  'Task delayed in silence for 5 days',
                  'Manager notices during retrospective',
                  'Downstream dependencies already blocked',
                  'Sprint misses deadline with no remedy',
                  'Project delivers late with increased budget'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-[#8992A8]">
                    <div className="w-5 h-5 rounded-full bg-[#171A2A] border border-[#252A3A] grid place-items-center text-[10px] font-mono text-[#555E73]">
                      ✕
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intelix Card */}
            <div className="surface-card rounded-2xl p-7 border border-[#4F7CFF]/40 bg-gradient-to-b from-[#131522] to-[#171A2A] shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#252A3A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39D9FF] shadow-[0_0_8px_#39D9FF]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#39D9FF] font-bold">Intelix Autonomous Intelligence</span>
              </div>
              <div className="space-y-4">
                {[
                  'Task delayed → Telemetry triggers early warning signal',
                  'Risk detected instantly before milestone slip',
                  'Root cause identified: Database migration is 3 days behind',
                  'Delivery impact calculated: +4 days across critical path',
                  'Action recommended: Reallocate 1 backend engineer',
                  'Manager acts proactively → Milestone delivered on schedule'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-medium text-[#F4F7FF]">
                    <div className="w-5 h-5 rounded-full bg-[#4F7CFF]/20 border border-[#4F7CFF]/40 grid place-items-center text-[10px] text-[#39D9FF]">
                      ✓
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTELLIGENCE CYCLE (HOW INTELIX THINKS) */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 border-t border-[#252A3A]">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="label-tech text-[#7C5CFF] mb-2">SYSTEM ARCHITECTURE</div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7FF] tracking-tight uppercase">
            HOW INTELIX THINKS
          </h2>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-2">
            The autonomous continuous 6-stage telemetry and intervention cycle.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'MONITOR', desc: 'Project activity, commits, sensor readings & sprint progress' },
            { step: '02', title: 'DETECT', desc: 'Emerging signals, schedule pressure & velocity variances' },
            { step: '03', title: 'EXPLAIN', desc: 'Root cause breakdown & dependency bottlenecks' },
            { step: '04', title: 'PREDICT', desc: 'Delivery impact, cascade slippage & completion date' },
            { step: '05', title: 'RECOMMEND', desc: 'Corrective action, resource pairing & capacity shift' },
            { step: '06', title: 'ACT', desc: 'Human decision execution with 1-click apply' }
          ].map((s, idx) => (
            <div key={idx} className="surface-card rounded-2xl p-5 border border-[#252A3A] relative group hover:border-[#4F7CFF]/50 transition">
              <div className="text-2xl font-black font-mono text-[#39D9FF] mb-2">{s.step}</div>
              <div className="text-xs font-bold text-[#F4F7FF] uppercase tracking-wider mb-2">{s.title}</div>
              <p className="text-[11px] text-[#8992A8] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: SIGNATURE RISK DEMO */}
      <section id="demo" className="relative z-10 py-24 px-6 border-t border-[#252A3A] bg-[#0D101A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="label-tech text-[#FF4D6D] mb-2">SIGNATURE DEMONSTRATION</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7FF] tracking-tight uppercase">
              SEE DELAY CASCADE SIMULATION IN ACTION
            </h2>
            <p className="text-xs sm:text-sm text-[#8992A8] mt-2">
              Witness how an upstream 3-day schema delay ripples across the critical path.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6 sm:p-8 border border-[#252A3A] shadow-2xl">
            <div className="space-y-4">
              {/* Node 1 */}
              <div className="p-4 rounded-xl bg-[#171A2A] border border-[#FF4D6D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF4D6D] animate-ping" />
                  <div>
                    <div className="text-xs font-mono font-bold text-[#FF859B]">UPSTREAM ORIGIN</div>
                    <div className="text-sm font-bold text-[#F4F7FF]">Database Schema Migration</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FF859B] px-2 py-0.5 rounded bg-[#FF4D6D]/15 border border-[#FF4D6D]/30">
                    3 DAYS BEHIND
                  </span>
                </div>
              </div>

              {/* Cascade Down */}
              <div className="pl-6 border-l-2 border-dashed border-[#FF4D6D]/40 ml-4 space-y-3 py-2">
                <div className="p-3 rounded-lg bg-[#131522] border border-[#252A3A] flex items-center justify-between text-xs">
                  <span className="text-[#8992A8]">Downstream Node 1: <strong className="text-[#F4F7FF]">Backend API Integration</strong></span>
                  <span className="text-[#FF859B] font-mono font-bold">⚠ AT RISK (+2 Days)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#131522] border border-[#252A3A] flex items-center justify-between text-xs">
                  <span className="text-[#8992A8]">Downstream Node 2: <strong className="text-[#F4F7FF]">Frontend Integration</strong></span>
                  <span className="text-[#FF859B] font-mono font-bold">⚠ AT RISK (+2 Days)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#131522] border border-[#252A3A] flex items-center justify-between text-xs">
                  <span className="text-[#8992A8]">Downstream Node 3: <strong className="text-[#F4F7FF]">Testing & Verification (WCAG)</strong></span>
                  <span className="text-[#FF859B] font-mono font-bold">⚠ AT RISK (+2 Days)</span>
                </div>
              </div>

              {/* Predicted Delay */}
              <div className="p-4 rounded-xl bg-[#080A12] border border-[#252A3A] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#8992A8] uppercase">PREDICTED PROJECT DELAY</div>
                  <div className="text-2xl font-black text-[#FF4D6D] font-mono mt-0.5">+4 DAYS</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#8992A8] uppercase">CONFIDENCE</div>
                  <div className="text-lg font-bold text-[#F4F7FF] font-mono">91%</div>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-[#171A2A] border border-[#7C5CFF]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="label-tech text-[#39D9FF] flex items-center gap-1.5 mb-1">
                    <Zap size={14} className="text-[#7C5CFF]" />
                    INTELIX RECOMMENDS
                  </div>
                  <div className="text-xs text-[#F4F7FF] font-semibold">
                    "Move one backend engineer to the database migration task."
                  </div>
                </div>
                <button
                  onClick={() => loginAsRole('manager')}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shrink-0"
                >
                  VIEW INTELLIGENCE →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CORE FEATURES */}
      <section className="relative z-10 py-24 px-6 border-t border-[#252A3A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="label-tech text-[#4F7CFF] mb-2">POWERFUL CAPABILITIES</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7FF] tracking-tight uppercase">
              BUILT FOR MISSION-CRITICAL EXECUTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
              <div className="text-sm font-mono text-[#39D9FF] font-bold mb-2">01 / UNIFIED PROJECT STATE</div>
              <h3 className="text-lg font-bold text-[#F4F7FF] mb-2">One source of truth for every stakeholder</h3>
              <p className="text-xs text-[#8992A8] leading-relaxed">
                Connect schedules, deliverables, blockers, and capacity across technical teams, executives, and ministry clients without fragmented status sheets.
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
              <div className="text-sm font-mono text-[#7C5CFF] font-bold mb-2">02 / DEPENDENCY-AWARE RISK</div>
              <h3 className="text-lg font-bold text-[#F4F7FF] mb-2">Understand how one delay ripples downstream</h3>
              <p className="text-xs text-[#8992A8] leading-relaxed">
                Autonomous critical-path modeling simulates how a single slip propagates across technical deliverables and milestone releases.
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
              <div className="text-sm font-mono text-[#18C997] font-bold mb-2">03 / EXPLAINABLE PREDICTION</div>
              <h3 className="text-lg font-bold text-[#F4F7FF] mb-2">Know not only what may happen, but why</h3>
              <p className="text-xs text-[#8992A8] leading-relaxed">
                Never accept a generic risk percentage. Intelix isolates the root cause into progress gaps, deadline pressure, vendor schema blocks, and overload factors.
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
              <div className="text-sm font-mono text-[#F5B942] font-bold mb-2">04 / ACTIONABLE RECOMMENDATIONS</div>
              <h3 className="text-lg font-bold text-[#F4F7FF] mb-2">Turn intelligence into a verified decision</h3>
              <p className="text-xs text-[#8992A8] leading-relaxed">
                Receive prescriptive rebalancing plans, pair engineering suggestions, and schedule accelerations with one-click interactive execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: ROLE EXPERIENCES */}
      <section id="roles" className="relative z-10 py-24 px-6 border-t border-[#252A3A] bg-[#0D101A]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="label-tech text-[#39D9FF] mb-2">ROLE-AWARE PLATFORM</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7FF] tracking-tight uppercase">
              ONE INTELLIGENCE LAYER. FIVE EXPERIENCES.
            </h2>
            <p className="text-xs sm:text-sm text-[#8992A8] mt-2">
              All stakeholders share the same unified data, tailored to their exact operational priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { roleId: 'manager', title: 'MANAGER', sub: 'Run the project', desc: 'Project control center, assignments, delivery outlook & team rebalance.' },
              { roleId: 'dev', title: 'DEVELOPER', sub: 'Do the work', desc: 'Active tasks, blocker reporting, sprint progress & upstream dependency context.' },
              { roleId: 'client', title: 'CLIENT', sub: 'Review the project', desc: 'Milestone progress, deliverable reviews, change requests & approvals.' },
              { roleId: 'exec', title: 'EXECUTIVE', sub: 'See the portfolio', desc: 'Portfolio health, strategic risks, delivery forecasts & high-level decisions.' },
              { roleId: 'admin', title: 'ADMIN', sub: 'Operate the platform', desc: 'User directories, roles, permission matrix, audit logs & system health.' }
            ].map(r => (
              <div
                key={r.roleId}
                onClick={() => loginAsRole(r.roleId)}
                className="surface-card rounded-2xl p-5 border border-[#252A3A] hover:border-[#4F7CFF] transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#39D9FF] mb-1">{r.title}</div>
                  <div className="text-sm font-bold text-[#F4F7FF] mb-2">{r.sub}</div>
                  <p className="text-[11px] text-[#8992A8] leading-relaxed">{r.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#252A3A] flex items-center justify-between text-[11px] font-bold text-[#4F7CFF] group-hover:text-[#39D9FF]">
                  <span>Launch View</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="relative z-10 py-24 px-6 border-t border-[#252A3A] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-[#F4F7FF] tracking-tight uppercase">
            DON'T WAIT FOR THE PROJECT <br />
            <span className="text-[#FF4D6D]">TO BECOME A PROBLEM.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8992A8]">
            "See the signal. Understand the cause. Take action."
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => loginAsRole('manager')}
              className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold"
            >
              EXPLORE INTELIX →
            </button>
            <button
              onClick={() => setAppMode('login')}
              className="btn-secondary px-6 py-3.5 rounded-xl text-sm font-bold"
            >
              REQUEST DEMO
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#252A3A] bg-[#080A12] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#555E73]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F4F7FF]">INTELIX</span>
            <span>·</span>
            <span>Project Execution Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#platform" className="hover:text-[#8992A8]">Platform</a>
            <a href="#how-it-works" className="hover:text-[#8992A8]">Intelligence</a>
            <button onClick={() => setAppMode('login')} className="hover:text-[#8992A8]">Sign In</button>
            <span>© 2026 Intelix. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
