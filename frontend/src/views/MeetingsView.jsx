import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function MeetingsView() {
  const { meetings, addTask, showToast } = useProject();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'

  const filteredMeetings = meetings.filter(m => activeTab === 'upcoming' ? m.status === 'Upcoming' : m.status === 'Past');

  const handleConvertToActionItem = (decisionText, project) => {
    addTask({
      title: `[Action Item] ${decisionText}`,
      project: project,
      priority: 'High',
      status: 'In Progress',
      progress: 0,
      due: '22 Sep'
    });
    showToast('Decision converted into actionable sprint deliverable!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">STAKEHOLDER SYNC</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECT MEETINGS & DECISION LOG
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Sync agenda, participant notes, strategic decisions, and actionable tasks."
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D101A] border border-[#252A3A]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'upcoming' ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]' : 'text-[#8992A8]'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'past' ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]' : 'text-[#8992A8]'}`}
          >
            Past Syncs
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map(meeting => (
          <div key={meeting.id} className="surface-card rounded-2xl p-6 border border-[#252A3A] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252A3A]">
              <div>
                <span className="text-[10px] font-mono text-[#39D9FF] uppercase tracking-wider block">
                  {meeting.project} · {meeting.date}
                </span>
                <h3 className="text-base font-bold text-[#F4F7FF] mt-0.5">{meeting.title}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold w-fit ${meeting.status === 'Upcoming' ? 'badge-info' : 'badge-success'}`}>
                {meeting.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A]">
                <div className="label-tech text-[#8992A8] mb-1">AGENDA & PARTICIPANTS</div>
                <p className="text-[#F4F7FF] font-medium">{meeting.agenda}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {meeting.participants.map((p, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#131522] border border-[#252A3A] text-[#8992A8]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-2">
                <div className="label-tech text-[#18C997]">DECISIONS & ACTION ITEMS</div>
                <div className="space-y-1">
                  {meeting.decisions.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[#F4F7FF]">✓ {d}</span>
                      <button
                        onClick={() => handleConvertToActionItem(d, meeting.project)}
                        className="text-[10px] text-[#4F7CFF] hover:text-[#39D9FF] font-mono font-bold shrink-0"
                      >
                        + Create Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
