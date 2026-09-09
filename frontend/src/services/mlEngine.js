/**
 * Intelix ML & Decision Intelligence Engine
 * Implements SIH Problem Statement SIH26103 algorithms:
 * 1. Real-time Task Risk Scoring (formula + FastAPI fallback)
 * 2. Critical Path & Delay Cascade Propagation
 * 3. AI Workload Auto-Rebalancer
 * 4. Earned Value Management (EVM) Metrics
 */

const ML_API_ENDPOINT = 'http://localhost:8000/predict';

/**
 * Calculates a task's risk score and predicted delay
 * Formula matches backend/ml/main.py:
 * score = min(100, round(progress_gap * 0.9 + max(0, 10 - days_remaining) * 4 + dependency_risk * 0.2 + max(0, workload - 80) * 0.5 + (20 if blocked else 0)))
 */
export function calculateLocalRiskScore({
  progress = 0,
  expectedProgress = 75,
  daysRemaining = 5,
  dependencyRisk = 0,
  workload = 75,
  blocked = false
}) {
  const progressGap = Math.max(0, expectedProgress - progress);
  const deadlineFactor = Math.max(0, 10 - daysRemaining) * 4;
  const depFactor = (dependencyRisk || 0) * 0.2;
  const workloadFactor = Math.max(0, workload - 80) * 0.5;
  const blockedFactor = blocked ? 20 : 0;

  const rawScore = progressGap * 0.9 + deadlineFactor + depFactor + workloadFactor + blockedFactor;
  const score = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));

  let level = 'LOW';
  let badgeColor = 'emerald';
  if (score >= 65) {
    level = 'CRITICAL';
    badgeColor = 'rose';
  } else if (score >= 40) {
    level = 'MEDIUM';
    badgeColor = 'amber';
  }

  const predictedDelayDays = Math.max(0, Math.round((progressGap / 18 + (blocked ? 1.5 : 0)) * 10) / 10);

  const recommendation = score >= 65
    ? (blocked ? 'Immediate escalation: Unblock upstream dependencies and assign pair engineer.' : 'High risk detected: Reallocate 1 team member to accelerate delivery by 2.5 days.')
    : score >= 40
    ? 'Moderate risk: Pull QA verification forward by 1 day and monitor sprint velocity.'
    : 'Execution on track: Healthy progression with low variance.';

  return {
    score,
    level,
    badgeColor,
    predictedDelayDays,
    recommendation,
    breakdown: {
      progressGapScore: Math.round(progressGap * 0.9),
      deadlinePressureScore: Math.round(deadlineFactor),
      dependencyRiskScore: Math.round(depFactor),
      workloadOverloadScore: Math.round(workloadFactor),
      blockedPenalty: blockedFactor
    }
  };
}

/**
 * Predicts risk via backend ML service with seamless local fallback
 */
export async function predictRiskScoreWithFallback(signal) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(ML_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        progress: signal.progress,
        expected_progress: signal.expectedProgress ?? 70,
        days_remaining: signal.daysRemaining ?? 5,
        dependency_risk: signal.dependencyRisk ?? 0,
        workload: signal.workload ?? 75,
        blocked: signal.blocked ?? false
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        score: data.risk_score,
        level: data.risk_level,
        badgeColor: data.risk_score >= 65 ? 'rose' : data.risk_score >= 40 ? 'amber' : 'emerald',
        predictedDelayDays: data.predicted_delay_days,
        recommendation: data.recommendation,
        fromApi: true
      };
    }
  } catch (err) {
    // API not reachable or timed out -> use high-fidelity client engine
  }

  return calculateLocalRiskScore(signal);
}

/**
 * Simulates Delay Propagation along the Dependency Chain
 * Returns all downstream tasks and milestones affected by a delay in sourceTaskId
 */
export function simulateDelayCascade(tasks, dependencies, sourceTaskId, injectedDelayDays) {
  const sourceTask = tasks.find(t => t.id === sourceTaskId);
  if (!sourceTask || injectedDelayDays <= 0) {
    return { affectedTasks: [], cascadeDelayTotal: 0, criticalPathHit: false };
  }

  const affectedMap = new Map();
  const queue = [{ taskId: sourceTaskId, accumulatedDelay: injectedDelayDays, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    const currentTask = tasks.find(t => t.id === current.taskId);
    if (!currentTask) continue;

    // Find all successor dependencies
    const outgoing = dependencies.filter(d => 
      d.fromId === current.taskId || d.fromTitle === currentTask.title
    );

    for (const dep of outgoing) {
      const targetTask = tasks.find(t => t.id === dep.toId || t.title === dep.toTitle);
      if (targetTask && !affectedMap.has(targetTask.id)) {
        // Damping factor: critical dependencies pass 100% delay, medium 60%
        const damping = dep.severity === 'Critical' ? 1.0 : dep.severity === 'High' ? 0.8 : 0.5;
        const propagatedDelay = Math.max(0.5, Math.round(current.accumulatedDelay * damping * 10) / 10);

        affectedMap.set(targetTask.id, {
          taskId: targetTask.id,
          title: targetTask.title,
          project: targetTask.project,
          originalDue: targetTask.due,
          delayAdded: propagatedDelay,
          totalDelay: propagatedDelay,
          severity: dep.severity || 'High',
          depth: current.depth + 1
        });

        queue.push({
          taskId: targetTask.id,
          accumulatedDelay: propagatedDelay,
          depth: current.depth + 1
        });
      }
    }
  }

  const affectedTasks = Array.from(affectedMap.values());
  const maxDelay = affectedTasks.reduce((max, t) => Math.max(max, t.totalDelay), injectedDelayDays);
  const criticalPathHit = affectedTasks.some(t => t.severity === 'Critical') || sourceTask.priority === 'Critical';

  return {
    sourceTask,
    injectedDelayDays,
    affectedTasks,
    cascadeDelayTotal: maxDelay,
    criticalPathHit
  };
}

/**
 * Intelligent AI Workload Rebalancing Algorithm
 * Identifies overloaded team members (>80% load) and shifts non-blocked pending tasks to available members (<75%)
 */
export function calculateRebalancePlan(teamWorkload, tasks) {
  const overloaded = teamWorkload.filter(m => m.load > 80);
  const available = teamWorkload.filter(m => m.load < 75).sort((a, b) => a.load - b.load);

  if (overloaded.length === 0 || available.length === 0) {
    return {
      canRebalance: false,
      message: 'Workload distribution is currently well-balanced across all team members.',
      suggestions: []
    };
  }

  const suggestions = [];
  const simulatedWorkload = teamWorkload.map(m => ({ ...m }));

  for (const source of overloaded) {
    // Find movable tasks assigned to this person (not completed)
    const movableTasks = tasks.filter(t => 
      t.assignee === source.name && 
      t.status !== 'Completed' && 
      t.status !== 'Blocked'
    );

    if (movableTasks.length > 0 && available.length > 0) {
      const taskToMove = movableTasks[0];
      const target = available[0];

      const loadShift = 15; // standard task load delta
      const sourceSim = simulatedWorkload.find(m => m.name === source.name);
      const targetSim = simulatedWorkload.find(m => m.name === target.name);

      if (sourceSim && targetSim) {
        sourceSim.load = Math.max(40, sourceSim.load - loadShift);
        sourceSim.loadStr = `${sourceSim.load}%`;
        targetSim.load = Math.min(85, targetSim.load + loadShift);
        targetSim.loadStr = `${targetSim.load}%`;

        suggestions.push({
          taskId: taskToMove.id,
          taskTitle: taskToMove.title,
          project: taskToMove.project,
          fromMember: source.name,
          toMember: target.name,
          fromRole: source.role || 'Member',
          toRole: target.role || 'Member',
          estimatedHours: taskToMove.estimatedHours || 16,
          riskReduction: Math.round(taskToMove.risk * 0.35),
          rationale: `${source.name} is at ${source.load}% capacity. Reassigning "${taskToMove.title}" to ${target.name} (${target.load}%) balances sprint velocity.`
        });
      }
    }
  }

  return {
    canRebalance: suggestions.length > 0,
    suggestions,
    simulatedWorkload
  };
}

/**
 * Computes Earned Value Management (EVM) for projects
 */
export function calculateEVM(project, projectTasks) {
  const plannedValue = project.budget || 50000;
  const progressFraction = (project.progress || 0) / 100;
  const earnedValue = Math.round(plannedValue * progressFraction);
  
  const totalTasks = projectTasks.length || 1;
  const doneTasks = projectTasks.filter(t => t.status === 'Completed').length;
  const actualCost = Math.round(plannedValue * ((doneTasks + 0.5 * (totalTasks - doneTasks)) / totalTasks) * 0.95);

  const costVariance = earnedValue - actualCost;
  const scheduleVariance = Math.round(earnedValue - (plannedValue * 0.75));
  
  const cpi = actualCost > 0 ? Math.round((earnedValue / actualCost) * 100) / 100 : 1.0;
  const spi = Math.round((earnedValue / (plannedValue * 0.75)) * 100) / 100;

  return {
    plannedValue,
    earnedValue,
    actualCost,
    costVariance,
    scheduleVariance,
    cpi,
    spi,
    costEfficiency: cpi >= 1 ? 'Under Budget' : 'Over Budget',
    scheduleEfficiency: spi >= 1 ? 'Ahead of Schedule' : 'Behind Schedule'
  };
}
