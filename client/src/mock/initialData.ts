import { User, Team, Project, Task, WorkflowTransitionRule, ColumnDefinition, NotificationItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Alex Vance (Lead Admin)',
    email: 'admin@supapulse.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    teamIds: ['team_eng', 'team_design', 'team_platform', 'team_qa']
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Jenkins (Fullstack Dev)',
    email: 'sarah.j@supapulse.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_eng']
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Brody (Lead QA / Tester)',
    email: 'marcus.qa@supapulse.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Tester',
    teamIds: ['team_eng', 'team_qa']
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova (UI/UX Architect)',
    email: 'elena.design@supapulse.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_design']
  },
  {
    id: 'usr_david',
    name: 'David Chen (DevOps & Security)',
    email: 'david.infra@supapulse.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_platform']
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_eng',
    name: 'Core Engineering',
    slug: 'core-eng',
    description: 'High-performance backend engines, real-time sync, and distributed APIs.',
    icon: 'Cpu',
    color: '#3ecf8e',
    memberIds: ['usr_admin', 'usr_sarah', 'usr_marcus']
  },
  {
    id: 'team_design',
    name: 'Product Design & UX',
    slug: 'design-ux',
    description: 'Design tokens, Asana-inspired Kanban canvas, and high-fidelity micro-interactions.',
    icon: 'Palette',
    color: '#a855f7',
    memberIds: ['usr_admin', 'usr_elena']
  },
  {
    id: 'team_platform',
    name: 'Platform & Security',
    slug: 'platform-infra',
    description: 'PostgreSQL clusters, Row-Level-Security (RLS) policies, and edge networks.',
    icon: 'ShieldCheck',
    color: '#3b82f6',
    memberIds: ['usr_admin', 'usr_david']
  },
  {
    id: 'team_qa',
    name: 'QA & Testing Guild',
    slug: 'qa-testing',
    description: 'End-to-end chaos engineering, automated testing pipelines, and release gates.',
    icon: 'CheckCircle2',
    color: '#f59e0b',
    memberIds: ['usr_admin', 'usr_marcus']
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_sync',
    teamId: 'team_eng',
    name: 'Supabase Realtime Sync Engine',
    key: 'ENG',
    description: 'Real-time WebSocket CDC protocol with sub-millisecond broadcast replication.',
    color: '#3ecf8e',
    createdAt: '2026-01-15'
  },
  {
    id: 'proj_auth',
    teamId: 'team_eng',
    name: 'Multi-Tenant Auth v3',
    key: 'AUTH',
    description: 'Zero-trust JWT sessions, SAML SSO, and granular role enforcement.',
    color: '#10b981',
    createdAt: '2026-02-01'
  },
  {
    id: 'proj_ui',
    teamId: 'team_design',
    name: 'Asana Canvas Design System',
    key: 'DS',
    description: 'Figma tokens translated to Tailwind CSS with sleek glassmorphism and Supabase dark mode.',
    color: '#a855f7',
    createdAt: '2026-01-20'
  },
  {
    id: 'proj_mobile',
    teamId: 'team_design',
    name: 'Mobile App Experience',
    key: 'MOB',
    description: 'Gestures, drag handles, and offline-first reactive cache synchronization.',
    color: '#c084fc',
    createdAt: '2026-02-10'
  },
  {
    id: 'proj_pg',
    teamId: 'team_platform',
    name: 'PostgreSQL RLS Partitioning',
    key: 'DB',
    description: 'Dynamic tenant isolation schemas using automated Row Level Security policies.',
    color: '#3b82f6',
    createdAt: '2026-01-05'
  },
  {
    id: 'proj_e2e',
    teamId: 'team_qa',
    name: 'Automated Regression Suites',
    key: 'QA',
    description: 'Playwright & load testing framework verifying transition gate invariants.',
    color: '#f59e0b',
    createdAt: '2026-02-12'
  }
];

export const COLUMNS: ColumnDefinition[] = [
  {
    id: 'pending',
    title: 'Backlog / Pending',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderHover: 'hover:border-amber-500/40',
    description: 'Incoming requirements, queued tickets, and backlog items'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/40',
    description: 'Actively being developed by assigned engineers'
  },
  {
    id: 'testing',
    title: 'Review & QA Testing',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderHover: 'hover:border-purple-500/40',
    description: 'Deployed to staging; awaiting QA tester verification or peer review'
  },
  {
    id: 'completed',
    title: 'Completed',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/40',
    description: 'Tested, passed QA checks, and deployed to production'
  },
  {
    id: 'failed',
    title: 'Failed / Rejected',
    color: '#ef4444',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderHover: 'hover:border-rose-500/40',
    description: 'QA rejected, broken tests, blocked dependencies or failed verification'
  }
];

export const DEFAULT_WORKFLOW_RULES: WorkflowTransitionRule[] = [
  // From Pending
  { from: 'pending', to: 'in_progress', allowed: true, description: 'Developer starts working on the task' },
  { from: 'pending', to: 'testing', allowed: false, description: 'Cannot skip straight to testing without active implementation' },
  { from: 'pending', to: 'completed', allowed: false, description: 'Tasks cannot jump from backlog directly to production' },
  { from: 'pending', to: 'failed', allowed: true, description: 'Reject invalid backlog tickets directly' },

  // From In Progress
  { from: 'in_progress', to: 'testing', allowed: true, description: 'Hand over code to QA testers or code review' },
  { from: 'in_progress', to: 'pending', allowed: true, description: 'Pause work or reprioritize back to backlog' },
  { from: 'in_progress', to: 'completed', allowed: true, requiredRole: ['Admin', 'Tester'], description: 'Direct pass (allowed for Admins or minor docs)' },
  { from: 'in_progress', to: 'failed', allowed: true, description: 'Mark as blocked due to external breaking dependency' },

  // From Testing
  { from: 'testing', to: 'completed', allowed: true, requiredRole: ['Admin', 'Tester'], description: 'QA Tester or Admin confirms test pass' },
  { from: 'testing', to: 'failed', allowed: true, requiredRole: ['Admin', 'Tester'], description: 'QA Tester rejects task due to defects or test failures' },
  { from: 'testing', to: 'in_progress', allowed: true, description: 'Send back to developer for adjustments' },
  { from: 'testing', to: 'pending', allowed: false, description: 'Must reject or return to in-progress, not drop to backlog' },

  // From Completed
  { from: 'completed', to: 'pending', allowed: false, description: 'Completed tasks are locked; use Re-open to In Progress instead' },
  { from: 'completed', to: 'in_progress', allowed: true, requiredRole: ['Admin'], description: 'Admin re-opens completed task if bug reported later' },
  { from: 'completed', to: 'testing', allowed: false, description: 'Cannot transition directly without active rework' },
  { from: 'completed', to: 'failed', allowed: false, description: 'Cannot fail an already accepted production deployment' },

  // From Failed
  { from: 'failed', to: 'in_progress', allowed: true, description: 'Developer addresses tester comments and bug reports' },
  { from: 'failed', to: 'pending', allowed: true, description: 'Move back to backlog for re-triage' },
  { from: 'failed', to: 'testing', allowed: true, description: 'Re-submit for verification once hotfix ready' },
  { from: 'failed', to: 'completed', allowed: false, description: 'Failed tasks must pass testing before being marked complete' }
];

export const INITIAL_TASKS: Task[] = [
  // Core Engineering Tasks
  {
    id: 'task_1',
    code: 'ENG-101',
    title: 'Implement WebSocket backoff jitter for Realtime cluster',
    description: 'Ensure client reconnect loop implements exponential backoff with full jitter to avoid thundering herd on server restart.',
    status: 'in_progress',
    priority: 'high',
    teamId: 'team_eng',
    projectId: 'proj_sync',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: '2026-11-24',
    tags: ['Realtime', 'WebSockets', 'Resilience'],
    subtasks: [
      { id: 'sub_1', title: 'Add exponential backoff calculation function', completed: true },
      { id: 'sub_2', title: 'Add decorrelated jitter algorithm', completed: true },
      { id: 'sub_3', title: 'Unit test reconnect sequence with MockSocket', completed: false }
    ],
    comments: [
      {
        id: 'c_1',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'Sarah, make sure to simulate high latency (400ms+) when running local stress scripts.',
        createdAt: '2026-11-16T10:15:00Z'
      }
    ],
    activity: [
      { id: 'act_1', userId: 'usr_sarah', userName: 'Sarah Jenkins', action: 'moved task to In Progress', timestamp: '2026-11-16T09:00:00Z', fromStatus: 'pending', toStatus: 'in_progress' }
    ],
    createdAt: '2026-11-15T08:30:00Z',
    updatedAt: '2026-11-16T10:15:00Z',
    order: 0
  },
  {
    id: 'task_2',
    code: 'ENG-102',
    title: 'PostgreSQL logical replication slot failover test',
    description: 'Verify seamless WAL replication slot synchronization when primary database initiates planned failover to replica.',
    status: 'testing',
    priority: 'urgent',
    teamId: 'team_eng',
    projectId: 'proj_sync',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: '2026-11-20',
    tags: ['Database', 'WAL', 'HA'],
    subtasks: [
      { id: 'sub_4', title: 'Configure pg_failover_slots extension', completed: true },
      { id: 'sub_5', title: 'Trigger manual Patroni switchover', completed: true },
      { id: 'sub_6', title: 'Verify zero message drop on subscriber', completed: false }
    ],
    comments: [
      {
        id: 'c_2',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'Testing currently running in Staging-2 cluster. Slot sync took 12ms!',
        createdAt: '2026-11-17T09:20:00Z'
      }
    ],
    activity: [
      { id: 'act_2', userId: 'usr_sarah', userName: 'Sarah Jenkins', action: 'moved task to Review & QA Testing', timestamp: '2026-11-17T08:00:00Z', fromStatus: 'in_progress', toStatus: 'testing' }
    ],
    testerNotes: 'Staging run in progress. Replication lag is < 5ms. Awaiting final chaos monkey test.',
    createdAt: '2026-11-14T11:00:00Z',
    updatedAt: '2026-11-17T09:20:00Z',
    order: 0
  },
  {
    id: 'task_3',
    code: 'ENG-103',
    title: 'GraphQL Schema Stitching for Tenant Microservices',
    description: 'Provide unified GraphQL gateway schema federated across core database instances and authentication servers.',
    status: 'pending',
    priority: 'medium',
    teamId: 'team_eng',
    projectId: 'proj_sync',
    reporterId: 'usr_admin',
    dueDate: '2026-11-30',
    tags: ['GraphQL', 'NestJS', 'Architecture'],
    subtasks: [
      { id: 'sub_7', title: 'Draft GraphQL SDL schema contract', completed: false },
      { id: 'sub_8', title: 'Setup NestJS GraphQL Federation module', completed: false }
    ],
    comments: [],
    activity: [
      { id: 'act_3', userId: 'usr_admin', userName: 'Alex Vance', action: 'created task in Backlog', timestamp: '2026-11-15T14:00:00Z' }
    ],
    createdAt: '2026-11-15T14:00:00Z',
    updatedAt: '2026-11-15T14:00:00Z',
    order: 0
  },
  {
    id: 'task_4',
    code: 'ENG-104',
    title: 'Redis JWT Revocation Blocklist Cache',
    description: 'Implement distributed bloom filter and token revocation check on every authenticated GraphQL query.',
    status: 'completed',
    priority: 'high',
    teamId: 'team_eng',
    projectId: 'proj_auth',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: '2026-11-15',
    tags: ['Auth', 'Security', 'Redis'],
    subtasks: [
      { id: 'sub_9', title: 'Create Redis token blacklist key structure', completed: true },
      { id: 'sub_10', title: 'Add NestJS Guard middleware check', completed: true },
      { id: 'sub_11', title: 'Perform load test with 50,000 req/s', completed: true }
    ],
    comments: [
      {
        id: 'c_3',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'All security penetration and load tests passed with flying colors. Marking completed!',
        createdAt: '2026-11-15T16:00:00Z'
      }
    ],
    activity: [
      { id: 'act_4', userId: 'usr_marcus', userName: 'Marcus Brody', action: 'verified and completed task', timestamp: '2026-11-15T16:00:00Z', fromStatus: 'testing', toStatus: 'completed' }
    ],
    testerNotes: 'Verified with OWASP ZAP token replay test. Tokens reliably rejected in under 1.2ms.',
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-15T16:00:00Z',
    order: 0
  },
  {
    id: 'task_5',
    code: 'ENG-105',
    title: 'Fix race condition during concurrent workspace invite acceptance',
    description: 'When two users click invite links simultaneously, unique constraint triggers an unhandled 500 error instead of a graceful team membership conflict.',
    status: 'failed',
    priority: 'urgent',
    teamId: 'team_eng',
    projectId: 'proj_auth',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: '2026-11-17',
    tags: ['Bug', 'Concurrency', 'Auth'],
    subtasks: [
      { id: 'sub_12', title: 'Reproduce with concurrent k6 script', completed: true },
      { id: 'sub_13', title: 'Add upsert with serializable isolation level', completed: false }
    ],
    comments: [
      {
        id: 'c_4',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'FAILED TEST: k6 script still showed 3 unhandled 500 errors during burst test of 50 concurrent invites. Reverting status to Failed.',
        createdAt: '2026-11-17T11:45:00Z'
      }
    ],
    activity: [
      { id: 'act_5', userId: 'usr_marcus', userName: 'Marcus Brody', action: 'rejected and marked Failed', timestamp: '2026-11-17T11:45:00Z', fromStatus: 'testing', toStatus: 'failed' }
    ],
    testerNotes: 'Defect reproduced in Staging environment. Logs attached: PostgreSQL Deadlock detected on workspace_members_pkey.',
    createdAt: '2026-11-13T13:00:00Z',
    updatedAt: '2026-11-17T11:45:00Z',
    order: 0
  },

  // Design & UX Team Tasks
  {
    id: 'task_6',
    code: 'DS-201',
    title: 'Design high-contrast Dark Mode palette with Supabase Emerald accents',
    description: 'Refine tokens for border contrast, neutral-900 surfaces, and subtle glowing emerald borders for focused and active cards.',
    status: 'in_progress',
    priority: 'high',
    teamId: 'team_design',
    projectId: 'proj_ui',
    assigneeId: 'usr_elena',
    reporterId: 'usr_admin',
    dueDate: '2026-11-22',
    tags: ['Design System', 'Figma', 'Colors'],
    subtasks: [
      { id: 'sub_14', title: 'Audit WCAG 2.1 AAA contrast ratios', completed: true },
      { id: 'sub_15', title: 'Publish Figma styles library', completed: true },
      { id: 'sub_16', title: 'Export Tailwind color variables', completed: false }
    ],
    comments: [],
    activity: [
      { id: 'act_6', userId: 'usr_elena', userName: 'Elena Rostova', action: 'started task', timestamp: '2026-11-16T11:00:00Z', fromStatus: 'pending', toStatus: 'in_progress' }
    ],
    createdAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-16T11:00:00Z',
    order: 0
  },
  {
    id: 'task_7',
    code: 'DS-202',
    title: 'Draggable Kanban Card Motion & Drop Feedback',
    description: 'Add fluid transition physics when dragging cards between columns with subtle drop placeholder indicators.',
    status: 'pending',
    priority: 'medium',
    teamId: 'team_design',
    projectId: 'proj_ui',
    assigneeId: 'usr_elena',
    reporterId: 'usr_admin',
    dueDate: '2026-11-28',
    tags: ['Animation', 'Micro-interactions'],
    subtasks: [
      { id: 'sub_17', title: 'Prototype card tilt effect on drag', completed: false },
      { id: 'sub_18', title: 'Define column highlight glow on hover', completed: false }
    ],
    comments: [],
    activity: [],
    createdAt: '2026-11-16T14:30:00Z',
    updatedAt: '2026-11-16T14:30:00Z',
    order: 0
  },
  {
    id: 'task_8',
    code: 'MOB-301',
    title: 'Mobile touch gesture handlers for column panning',
    description: 'Ensure horizontal swipe between columns feels native on iOS and Android devices without jitter.',
    status: 'completed',
    priority: 'low',
    teamId: 'team_design',
    projectId: 'proj_mobile',
    assigneeId: 'usr_elena',
    reporterId: 'usr_admin',
    dueDate: '2026-11-14',
    tags: ['Mobile', 'Gestures'],
    subtasks: [
      { id: 'sub_19', title: 'Touch velocity calculation', completed: true },
      { id: 'sub_20', title: 'Prevent vertical scroll lockup', completed: true }
    ],
    comments: [],
    activity: [],
    createdAt: '2026-11-10T12:00:00Z',
    updatedAt: '2026-11-14T17:00:00Z',
    order: 0
  },

  // Platform & Security Tasks
  {
    id: 'task_9',
    code: 'DB-401',
    title: 'Enforce Postgres Row Level Security (RLS) on team_id tenant boundaries',
    description: 'Verify that every table has ALTER TABLE ENABLE ROW LEVEL SECURITY with policy `USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))`.',
    status: 'testing',
    priority: 'urgent',
    teamId: 'team_platform',
    projectId: 'proj_pg',
    assigneeId: 'usr_david',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: '2026-11-21',
    tags: ['PostgreSQL', 'RLS', 'Security'],
    subtasks: [
      { id: 'sub_21', title: 'Write migration script with RLS helper functions', completed: true },
      { id: 'sub_22', title: 'Test bypass attempts with malicious JWT claims', completed: true },
      { id: 'sub_23', title: 'Benchmark query planner index hit rate', completed: false }
    ],
    comments: [
      {
        id: 'c_5',
        userId: 'usr_david',
        userName: 'David Chen',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        userRole: 'Member',
        text: 'RLS policies have been applied on Staging database. Ready for QA security audit.',
        createdAt: '2026-11-17T08:45:00Z'
      }
    ],
    activity: [
      { id: 'act_7', userId: 'usr_david', userName: 'David Chen', action: 'moved task to Testing', timestamp: '2026-11-17T08:45:00Z', fromStatus: 'in_progress', toStatus: 'testing' }
    ],
    testerNotes: 'Audit in progress. Automated SQL injection test suite running.',
    createdAt: '2026-11-12T10:00:00Z',
    updatedAt: '2026-11-17T08:45:00Z',
    order: 0
  },

  // QA Guild Tasks
  {
    id: 'task_10',
    code: 'QA-501',
    title: 'Automated Playwright test for invalid workflow state transitions',
    description: 'Write end-to-end tests to verify that non-admin users cannot drag tasks from Pending directly to Completed.',
    status: 'in_progress',
    priority: 'high',
    teamId: 'team_qa',
    projectId: 'proj_e2e',
    assigneeId: 'usr_marcus',
    reporterId: 'usr_admin',
    dueDate: '2026-11-23',
    tags: ['Playwright', 'E2E', 'Automation'],
    subtasks: [
      { id: 'sub_24', title: 'Write test fixture for Sarah (Member)', completed: true },
      { id: 'sub_25', title: 'Assert error toast appears on illegal drag', completed: false },
      { id: 'sub_26', title: 'Verify select-box disabled states', completed: false }
    ],
    comments: [],
    activity: [],
    createdAt: '2026-11-16T15:00:00Z',
    updatedAt: '2026-11-16T15:00:00Z',
    order: 0
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_admin',
    senderName: 'Marcus Brody',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Task Rejected by QA',
    message: 'ENG-105: Fix race condition during workspace invite acceptance was rejected and marked Failed.',
    taskId: 'task_5',
    teamId: 'team_eng',
    type: 'testing_failed',
    read: false,
    createdAt: '2026-11-17T11:45:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_admin',
    senderName: 'David Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Ready for Review',
    message: 'DB-401: PostgreSQL Row Level Security (RLS) policies deployed to Staging for audit.',
    taskId: 'task_9',
    teamId: 'team_platform',
    type: 'review_required',
    read: false,
    createdAt: '2026-11-17T08:45:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_admin',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Task Completed',
    message: 'ENG-104: Redis JWT Revocation Blocklist Cache passed all performance benchmarks.',
    taskId: 'task_4',
    teamId: 'team_eng',
    type: 'completed',
    read: true,
    createdAt: '2026-11-15T16:00:00Z'
  },
  {
    id: 'notif_4',
    userId: 'usr_sarah',
    senderName: 'Alex Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Assigned to New Task',
    message: 'You have been assigned to ENG-101: Implement WebSocket backoff jitter.',
    taskId: 'task_1',
    teamId: 'team_eng',
    type: 'assignment',
    read: false,
    createdAt: '2026-11-15T09:00:00Z'
  }
];
