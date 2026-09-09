import React, { useState } from 'react';
import {
  Server,
  Cpu,
  RefreshCw,
  ShieldCheck,
  Check,
  Sliders,
  Database,
  Lock,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function SettingsView() {
  const { resetToDefaults, showToast, activeRole } = useProject();

  const [weights, setWeights] = useState({
    progressGapWeight: 0.9,
    deadlineWeight: 4.0,
    dependencyWeight: 0.2,
    workloadWeight: 0.5,
    blockerPenalty: 20
  });

  const handleSaveWeights = (e) => {
    e.preventDefault();
    showToast('Decision Intelligence algorithm weights updated', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#252A3A]">
        <div className="label-tech text-[#39D9FF]">SYSTEM ADMINISTRATION & SETTINGS</div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
          SYSTEM CONFIGURATION & ML ENGINE TUNING
        </h1>
        <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
          "Review enterprise connection endpoints, calibrate risk algorithm sensitivities, and manage audit logs."
        </p>
      </div>

      {/* Decision Engine Weight Tuning */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#4F7CFF]/15 text-[#39D9FF] grid place-items-center">
            <Sliders size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FF]">
              ML Risk Scoring Weights (Formula Calibrator)
            </h3>
            <p className="text-xs text-[#8992A8]">
              Tuning parameters for the continuous task schedule pressure calculation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveWeights} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-tech text-[#8992A8] block mb-1.5">
                PROGRESS GAP MULTIPLIER (0.1–2.0)
              </label>
              <input
                type="number"
                step="0.1"
                value={weights.progressGapWeight}
                onChange={(e) => setWeights({ ...weights, progressGapWeight: +e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] font-mono"
              />
            </div>

            <div>
              <label className="label-tech text-[#8992A8] block mb-1.5">
                DEADLINE PRESSURE FACTOR (1.0–10.0)
              </label>
              <input
                type="number"
                step="0.5"
                value={weights.deadlineWeight}
                onChange={(e) => setWeights({ ...weights, deadlineWeight: +e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] font-mono"
              />
            </div>

            <div>
              <label className="label-tech text-[#8992A8] block mb-1.5">
                WORKLOAD OVERLOAD PENALTY (0.1–1.5)
              </label>
              <input
                type="number"
                step="0.1"
                value={weights.workloadWeight}
                onChange={(e) => setWeights({ ...weights, workloadWeight: +e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] font-mono"
              />
            </div>

            <div>
              <label className="label-tech text-[#8992A8] block mb-1.5">
                ACTIVE BLOCKER HARD PENALTY (PTS)
              </label>
              <input
                type="number"
                step="5"
                value={weights.blockerPenalty}
                onChange={(e) => setWeights({ ...weights, blockerPenalty: +e.target.value })}
                className="w-full px-3.5 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
            >
              Save Algorithm Weights
            </button>
          </div>
        </form>
      </div>

      {/* Backend & Microservice Endpoints */}
      <div className="surface-card rounded-2xl p-6 border border-[#252A3A]">
        <h3 className="text-sm font-bold text-[#F4F7FF] mb-4 flex items-center gap-2">
          <Server size={16} className="text-[#39D9FF]" />
          <span>Microservice Endpoints & Integration Status</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#F4F7FF]">Spring Boot Core Backend</div>
              <div className="text-[10px] text-[#8992A8] font-mono">http://localhost:8080/api/v1</div>
            </div>
            <span className="badge-success text-[10px] px-2 py-0.5 rounded font-mono font-bold">ONLINE</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#F4F7FF]">FastAPI Decision Engine & ML Predictor</div>
              <div className="text-[10px] text-[#8992A8] font-mono">http://localhost:8000/predict</div>
            </div>
            <span className="badge-success text-[10px] px-2 py-0.5 rounded font-mono font-bold">ONLINE</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#F4F7FF]">PostgreSQL Database Store</div>
              <div className="text-[10px] text-[#8992A8] font-mono">postgresql://intelix_db:5432</div>
            </div>
            <span className="badge-success text-[10px] px-2 py-0.5 rounded font-mono font-bold">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="surface-card rounded-2xl p-6 border border-[#FF4D6D]/30 bg-[#131522]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#FF859B] flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>Reset to Default Intelligence State</span>
            </h3>
            <p className="text-xs text-[#8992A8] mt-1">
              Clears localStorage and restores initial initiatives, dependencies, tasks, and recommendations.
            </p>
          </div>

          <button
            onClick={resetToDefaults}
            className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#FF859B] hover:text-[#FF4D6D] border-[#FF4D6D]/40 shrink-0"
          >
            Reset Default Data
          </button>
        </div>
      </div>
    </div>
  );
}
