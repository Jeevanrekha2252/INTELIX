import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateRebalancePlan } from '../services/mlEngine';

const QUICK_PROMPTS = [
  { label: '🚨 Active Blockers', text: 'Which deliverables are currently blocked and what is holding them up?' },
  { label: '⚖️ Team Bandwidth', text: 'Are any engineers overloaded and how can we redistribute sprint deliverables?' },
  { label: '📊 Portfolio Status', text: 'Give me a brief executive summary of all 4 initiatives.' },
  { label: '🛡️ Action Recommendations', text: 'What are the top 3 actionable steps we should take today?' }
];

export default function AiCopilotModal() {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    projects,
    tasks,
    teamWorkload,
    applyRebalancePlan,
    showToast,
    setActiveView
  } = useProject();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your **Intelix Project Assistant**.\n\nI monitor your sprint deliverables, active blockers, team capacity, and delivery schedules across all initiatives. What would you like to review?',
      actions: []
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsCopilotOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isCopilotOpen) {
        setIsCopilotOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen, setIsCopilotOpen]);

  useEffect(() => {
    if (isCopilotOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isCopilotOpen]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(query);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', ...response }]);
      setIsTyping(false);
    }, 600);
  };

  const generateAiResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Blockers
    if (q.includes('block') || q.includes('hold') || q.includes('impediment') || q.includes('risk')) {
      const blockedTasks = tasks.filter(t => t.blocked);
      const highRisk = tasks.filter(t => t.risk >= 65 && !t.blocked);

      let text = `### 🚨 Active Blockers & Critical Items\n\n`;
      if (blockedTasks.length > 0) {
        text += `**Blocked Deliverables:**\n` +
          blockedTasks.map(t => `• **${t.title}** (${t.project.split('—')[0]})\n  *Assignee:* ${t.assignee} | *Due:* ${t.due}\n  *Blocker:* ${t.blockerReason || 'Waiting on external dependency'}`).join('\n\n') + '\n\n';
      }
      if (highRisk.length > 0) {
        text += `**High Risk Watchlist:**\n` +
          highRisk.map(t => `• **${t.title}** (${t.assignee}) — ${t.progress}% done, due in ${t.daysRemaining} days (Risk: ${t.risk}/100)`).join('\n');
      }

      return {
        text,
        actions: [
          {
            label: 'Open Risk Center',
            onClick: () => {
              setActiveView('Risk Center');
              setIsCopilotOpen(false);
            }
          }
        ]
      };
    }

    // 2. Workload & Capacity
    if (q.includes('workload') || q.includes('balance') || q.includes('capacity') || q.includes('team') || q.includes('overload')) {
      const rebalancePlan = calculateRebalancePlan(teamWorkload, tasks);
      const overloaded = teamWorkload.filter(m => m.load > 80);

      let text = `### ⚖️ Team Bandwidth Overview\n\n` +
        `**Overloaded Team Members (>80% Capacity):**\n` +
        overloaded.map(m => `• **${m.name}** (${m.role}): **${m.load}%** load (${m.loggedHours}h / 40h)`).join('\n') + `\n\n`;

      if (rebalancePlan.canRebalance) {
        text += `**Recommended Rebalance Plan:**\n` +
          rebalancePlan.suggestions.map(s => `• Move *"${s.taskTitle}"* from **${s.fromMember}** → **${s.toMember}** to balance sprint delivery.`);
      } else {
        text += `Sprint bandwidth is currently well-distributed across engineers.`;
      }

      return {
        text,
        actions: rebalancePlan.canRebalance ? [
          {
            label: `⚡ Apply Workload Rebalance (${rebalancePlan.suggestions.length} Tasks)`,
            primary: true,
            onClick: () => {
              applyRebalancePlan(rebalancePlan.suggestions);
              showToast('Workload rebalanced across sprint team!', 'success');
              setIsCopilotOpen(false);
            }
          },
          {
            label: 'View Team Bandwidth',
            onClick: () => {
              setActiveView('Team Workload');
              setIsCopilotOpen(false);
            }
          }
        ] : [
          {
            label: 'View Team Bandwidth',
            onClick: () => {
              setActiveView('Team Workload');
              setIsCopilotOpen(false);
            }
          }
        ]
      };
    }

    // 3. Status Summary
    if (q.includes('status') || q.includes('summary') || q.includes('portfolio') || q.includes('health') || q.includes('overview')) {
      const avgHealth = Math.round(projects.reduce((acc, p) => acc + p.health, 0) / projects.length);
      const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);

      return {
        text: `### 📊 Executive Portfolio Brief\n\n` +
          `• **Average Portfolio Health:** **${avgHealth} / 100**\n` +
          `• **Total Allocated Capital:** **₹${totalBudget.toLocaleString('en-IN')}**\n` +
          `• **Total Sprint Deliverables:** **${tasks.length} Deliverables** (${tasks.filter(t => t.status === 'Completed').length} completed)\n\n` +
          `**Initiatives Summary:**\n` +
          projects.map(p => `• **${p.name}:** Health ${p.health}/100 | ${p.progress}% done | ETA: ${p.predicted} (${p.status})`).join('\n'),
        actions: [
          {
            label: 'View Initiatives Portfolio',
            onClick: () => {
              setActiveView('Projects');
              setIsCopilotOpen(false);
            }
          }
        ]
      };
    }

    // Default
    return {
      text: `### 💡 Quick Project Intelligence\n\n` +
        `• **1 Blocked Deliverable** detected on Jal Jeevan Mission IoT Gateway.\n` +
        `• **2 Engineers** are near full weekly capacity (Ishaan & Kabir).\n` +
        `• **3 of 4 Initiatives** are strictly on-track for targeted release dates.\n\n` +
        `You can ask me about **"active blockers"**, **"team bandwidth"**, or **"portfolio status"**.`,
      actions: [
        {
          label: 'Open Executive Dashboard',
          onClick: () => {
            setActiveView('Overview');
            setIsCopilotOpen(false);
          }
        }
      ]
    };
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="surface-modal rounded-2xl w-full max-w-2xl h-[580px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 grid place-items-center">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Intelix Project Assistant</div>
              <div className="text-[11px] text-slate-400">Contextual sprint guidance & portfolio analysis</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              Ctrl+/
            </kbd>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="px-5 py-2 border-b border-slate-800 bg-[#080c14] flex items-center gap-2 overflow-x-auto scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Prompts:</span>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.text)}
              className="shrink-0 text-[11px] px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAi ? <Sparkles size={13} /> : 'U'}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2.5 ${
                    isAi
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-blue-600 text-white font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                      {msg.actions.map((act, index) => (
                        <button
                          key={index}
                          onClick={act.onClick}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            act.primary
                              ? 'bg-blue-600 text-white hover:bg-blue-500'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {act.label}
                          <ArrowRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 grid place-items-center">
                <Sparkles size={13} />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                Analyzing sprint status...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about sprint deliverables, blockers, or team capacity..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
