import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  FileText,
  X,
  Send
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export default function MeetingsView() {
  const {
    meetings,
    scheduleMeeting,
    convertMeetingActionToTask,
    projects,
    showToast,
    activeRole
  } = useProject();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project: projects[0]?.name || 'Smart Campus 360',
    date: 'Tomorrow, 3:00 PM',
    agenda: '',
    participants: 'Sarah Jenkins, Alex Chen, David Vance (Dean)'
  });

  const filteredMeetings = meetings.filter(m => activeTab === 'upcoming' ? m.status === 'Upcoming' : m.status === 'Past');

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.agenda) {
      showToast('Please provide a meeting title and agenda', 'warning');
      return;
    }
    scheduleMeeting({
      title: formData.title,
      project: formData.project,
      date: formData.date,
      agenda: formData.agenda,
      participants: formData.participants.split(',').map(p => p.trim()).filter(Boolean),
      decisions: ['Follow up on telemetry indexing benchmarks and sprint capacity.']
    });
    setIsScheduleModalOpen(false);
    setFormData({
      title: '',
      project: projects[0]?.name || 'Smart Campus 360',
      date: 'Tomorrow, 3:00 PM',
      agenda: '',
      participants: 'Sarah Jenkins, Alex Chen, David Vance (Dean)'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#252A3A]">
        <div>
          <div className="label-tech text-[#39D9FF]">STAKEHOLDER SYNC</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight mt-0.5">
            PROJECT MEETINGS & ACTION ITEM REPOSITORY
          </h1>
          <p className="text-xs sm:text-sm text-[#8992A8] mt-1">
            "Coordinate cross-functional syncs, record formal decisions, and convert action items directly into sprint tasks."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D101A] border border-[#252A3A]">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'upcoming' ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]' : 'text-[#8992A8]'}`}
            >
              Upcoming ({meetings.filter(m => m.status === 'Upcoming').length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'past' ? 'bg-[#131522] text-[#F4F7FF] border border-[#252A3A]' : 'text-[#8992A8]'}`}
            >
              Past Syncs ({meetings.filter(m => m.status === 'Past').length})
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map(meeting => (
          <div key={meeting.id} className="surface-card rounded-2xl p-6 border border-[#252A3A] space-y-4 shadow-xl">
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
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#131522] border border-[#252A3A] text-[#8992A8] font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D101A] border border-[#252A3A] space-y-2">
                <div className="label-tech text-[#18C997]">DECISIONS & 1-CLICK ACTION ITEMS</div>
                <div className="space-y-1.5">
                  {meeting.decisions.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#131522] border border-[#252A3A]">
                      <span className="text-[#F4F7FF] text-[11px]">✓ {d}</span>
                      <button
                        onClick={() => convertMeetingActionToTask(d, meeting.project)}
                        className="btn-primary px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 flex items-center gap-1"
                      >
                        <span>+ Task</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="surface-card rounded-2xl p-6 max-w-lg w-full border border-[#252A3A] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#252A3A]">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-[#39D9FF]" />
                <h3 className="text-base font-bold text-[#F4F7FF]">Schedule Stakeholder Sync</h3>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-[#8992A8] hover:text-[#F4F7FF]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Path Bottleneck & Delivery Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Initiative
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomorrow, 3:30 PM"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Participants (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Sarah Jenkins, Alex Chen, David Vance"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div>
                <label className="block text-[#8992A8] font-semibold mb-1.5 font-mono text-[10px] uppercase">
                  Agenda & Focus
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Review schema migration velocity and resolve downstream blocker..."
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D101A] border border-[#252A3A] rounded-xl text-[#F4F7FF] focus:outline-none focus:border-[#4F7CFF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#252A3A]">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm & Schedule Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
