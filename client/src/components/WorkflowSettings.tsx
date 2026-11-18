import React from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus } from '../types';
import { 
  GitMerge, ShieldCheck, CheckCircle2, XCircle, 
  HelpCircle, RefreshCw, AlertCircle, Lock, Unlock 
} from 'lucide-react';

export const WorkflowSettings: React.FC = () => {
  const { 
    workflowRules, 
    updateWorkflowRule, 
    columns, 
    currentUser, 
    showToast 
  } = useApp();

  const statuses: TaskStatus[] = ['pending', 'in_progress', 'testing', 'completed', 'failed'];

  const getRule = (from: TaskStatus, to: TaskStatus) => {
    return workflowRules.find(r => r.from === from && r.to === to);
  };

  const handleToggle = (from: TaskStatus, to: TaskStatus, currentAllowed: boolean) => {
    if (from === to) return;

    if (currentUser.role !== 'Admin') {
      showToast('warning', 'Admin Access Required', 'Only Administrators can modify team workflow state transition policies.');
      return;
    }

    updateWorkflowRule(from, to, !currentAllowed);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#242424] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#3ecf8e] text-xs font-semibold uppercase tracking-wider mb-1">
              <GitMerge className="w-4 h-4" />
              <span>Workflow State Transition Policy</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100">
              Configurable Task Lifecycle Rules
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Control and enforce which states tasks can transition between. Prevent illegal jumps 
              (e.g., jumping from <em>Pending</em> directly to <em>Completed</em> without Testing) 
              or allow re-opening from <em>Completed</em> back to <em>Pending</em> or <em>In Progress</em>.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] text-xs">
            <span className="text-neutral-400">Current Operator: </span>
            <span className="font-semibold text-neutral-200">{currentUser.name}</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/30">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Transition Matrix */}
        <div className="rounded-2xl border border-[#242424] bg-[#161616] overflow-hidden">
          <div className="p-4 bg-[#1a1a1a] border-b border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3ecf8e]" />
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
                State Transition Matrix (From Row → To Column)
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400">
              Click any cell to toggle allowed transitions
            </span>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left font-semibold text-neutral-400 uppercase text-[10px] border-b border-r border-[#262626]">
                    From \ To
                  </th>
                  {statuses.map(to => {
                    const col = columns.find(c => c.id === to);
                    return (
                      <th
                        key={to}
                        className="p-3 font-semibold text-neutral-300 text-[11px] border-b border-[#262626]"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: col?.color }} 
                          />
                          <span>{col?.title.split('/')[0]}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {statuses.map(from => {
                  const fromCol = columns.find(c => c.id === from);
                  return (
                    <tr key={from} className="hover:bg-[#1a1a1a]">
                      <td className="p-3 text-left font-semibold text-neutral-300 border-r border-[#262626] bg-[#141414]">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: fromCol?.color }} 
                          />
                          <span>{fromCol?.title.split('/')[0]}</span>
                        </div>
                      </td>

                      {statuses.map(to => {
                        if (from === to) {
                          return (
                            <td key={to} className="p-3 text-neutral-600 bg-neutral-900/40">
                              <span className="text-[10px]">— (Same)</span>
                            </td>
                          );
                        }

                        const rule = getRule(from, to);
                        const isAllowed = rule ? rule.allowed : false;

                        return (
                          <td key={to} className="p-3">
                            <button
                              onClick={() => handleToggle(from, to, isAllowed)}
                              title={rule?.description || `${from} to ${to}`}
                              className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                isAllowed
                                  ? 'bg-[#18281e] border-[#3ecf8e]/40 text-[#3ecf8e] hover:border-[#3ecf8e]'
                                  : 'bg-[#22181a] border-rose-500/30 text-rose-400 hover:border-rose-500/60'
                              }`}
                            >
                              {isAllowed ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Allowed</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Blocked</span>
                                </>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Rules List with Explanations */}
        <div className="rounded-2xl border border-[#242424] bg-[#161616] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#3ecf8e]" />
              Detailed Governance & Transition Invariants
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">
              Total Rules Configured: {workflowRules.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workflowRules.map((rule, idx) => {
              const fromCol = columns.find(c => c.id === rule.from);
              const toCol = columns.find(c => c.id === rule.to);

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                    rule.allowed
                      ? 'bg-[#181c19] border-[#2a382d]'
                      : 'bg-[#1d1718] border-[#382628]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                      <span style={{ color: fromCol?.color }}>{fromCol?.title.split('/')[0]}</span>
                      <span className="text-neutral-500">➔</span>
                      <span style={{ color: toCol?.color }}>{toCol?.title.split('/')[0]}</span>
                      {rule.requiredRole && (
                        <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {rule.requiredRole.join('/')} Only
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggle(rule.from, rule.to, rule.allowed)}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      rule.allowed
                        ? 'border-[#3ecf8e]/40 text-[#3ecf8e] hover:bg-[#3ecf8e]/10'
                        : 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'
                    }`}
                    title={rule.allowed ? 'Click to Disable Transition' : 'Click to Allow Transition'}
                  >
                    {rule.allowed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
