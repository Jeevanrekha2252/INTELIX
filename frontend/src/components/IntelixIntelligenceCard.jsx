import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingDown,
  HelpCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function IntelixIntelligenceCard({
  level = 'HIGH RISK',
  score = 87,
  whatHappened = 'Backend API is delayed.',
  why = 'Database migration is 3 days behind expected progress.',
  whatWillHappen = 'Frontend integration may shift by approximately 2 days.',
  impact = '+4 days predicted project delay.',
  confidence = '91%',
  whatShouldIDo = 'Move one available backend engineer to the database migration task.',
  onViewAnalysis,
  onTakeAction,
  actionButtonText = 'Take Action',
  className = ''
}) {
  const isHigh = score >= 65 || level.toUpperCase().includes('HIGH');
  const isMed = !isHigh && (score >= 40 || level.toUpperCase().includes('MEDIUM'));

  const badgeColor = isHigh
    ? 'badge-critical'
    : isMed
    ? 'badge-warning'
    : 'badge-success';

  const accentBorder = isHigh
    ? 'border-[#FF4D6D]/40'
    : isMed
    ? 'border-[#F5B942]/40'
    : 'border-[#18C997]/40';

  const accentGlow = isHigh
    ? 'rgba(255, 77, 109, 0.08)'
    : isMed
    ? 'rgba(245, 185, 66, 0.08)'
    : 'rgba(24, 201, 151, 0.08)';

  return (
    <div
      className={`surface-card rounded-2xl p-5 sm:p-6 border relative overflow-hidden transition-all duration-200 ${accentBorder} ${className}`}
      style={{
        background: `radial-gradient(circle at top right, ${accentGlow} 0%, #131522 65%)`
      }}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252A3A]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 grid place-items-center text-[#7C5CFF]">
            <Sparkles size={15} />
          </div>
          <div>
            <span className="label-tech text-[#39D9FF]">INTELIX INTELLIGENCE</span>
            <div className="text-xs text-[#8992A8]">Real-time Predictive Diagnostic</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono ${badgeColor}`}>
            {level} · {score}/100
          </span>
          <span className="px-2 py-1 rounded-md bg-[#171A2A] border border-[#252A3A] text-[10px] text-[#8992A8] font-mono">
            CONFIDENCE: <strong className="text-[#F4F7FF]">{confidence}</strong>
          </span>
        </div>
      </div>

      {/* Signature 4-Step Analytical Progression */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1: What Happened */}
        <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]/80">
          <div className="label-tech text-[#8992A8] flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
            WHAT HAPPENED?
          </div>
          <p className="text-[#F4F7FF] font-medium leading-relaxed">
            {whatHappened}
          </p>
        </div>

        {/* Step 2: Why */}
        <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]/80">
          <div className="label-tech text-[#8992A8] flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B942]" />
            WHY? (ROOT CAUSE)
          </div>
          <p className="text-[#8992A8] leading-relaxed">
            {why}
          </p>
        </div>

        {/* Step 3: What Will Happen & Impact */}
        <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]/80">
          <div className="label-tech text-[#8992A8] flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39D9FF]" />
            WHAT WILL HAPPEN? (IMPACT)
          </div>
          <p className="text-[#8992A8] leading-relaxed mb-2">
            {whatWillHappen}
          </p>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[11px] font-mono font-bold text-[#FF859B]">
            <TrendingDown size={12} />
            {impact}
          </div>
        </div>

        {/* Step 4: What Should I Do */}
        <div className="p-3.5 rounded-xl bg-[#171A2A] border border-[#7C5CFF]/40">
          <div className="label-tech text-[#AE9AFF] flex items-center gap-1.5 mb-1.5">
            <Zap size={13} className="text-[#7C5CFF]" />
            WHAT SHOULD I DO? (RECOMMENDED ACTION)
          </div>
          <p className="text-[#F4F7FF] font-medium leading-relaxed">
            {whatShouldIDo}
          </p>
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="mt-5 pt-4 border-t border-[#252A3A] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-[#555E73] flex items-center gap-1.5">
          <Activity size={12} className="text-[#39D9FF]" />
          <span>Execution intelligence generated by Intelix Decision Engine</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onViewAnalysis && (
            <button
              onClick={onViewAnalysis}
              className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              View Analysis
            </button>
          )}
          {onTakeAction && (
            <button
              onClick={onTakeAction}
              className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <span>{actionButtonText}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
