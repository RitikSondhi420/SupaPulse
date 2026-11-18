import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, UserRole, Team, Project, Task, TaskStatus, 
  WorkflowTransitionRule, NotificationItem, 
  ColumnDefinition, Subtask 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_TEAMS, INITIAL_PROJECTS, 
  INITIAL_TASKS, DEFAULT_WORKFLOW_RULES, COLUMNS, 
  INITIAL_NOTIFICATIONS 
} from '../mock/initialData';
import { checkBackendHealth, fetchGraphQL, setStoredToken } from '../graphql/client';
import { 
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  USERS_QUERY,
  MY_TEAMS_QUERY,
  PROJECTS_QUERY,
  TASKS_QUERY,
  WORKFLOW_RULES_QUERY,
  NOTIFICATIONS_QUERY,
  CREATE_TASK_MUTATION, 
  MOVE_TASK_MUTATION, 
  SUBMIT_TESTER_VERDICT_MUTATION, 
  UPDATE_WORKFLOW_RULE_MUTATION,
  CREATE_TEAM_MUTATION,
  CREATE_PROJECT_MUTATION 
} from '../graphql/operations';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Auth & Identity
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  syncFromBackend: () => Promise<void>;
  
  // Teams & Isolation
  teams: Team[];
  currentTeam: Team;
  userTeams: Team[];
  switchTeam: (teamId: string) => boolean;
  createTeam: (name: string, description: string, color: string) => void;
  addTeamMember: (teamId: string, userId: string) => void;
  removeTeamMember: (teamId: string, userId: string) => void;

  // Projects
  projects: Project[];
  teamProjects: Project[];
  currentProject: Project | null;
  setCurrentProject: (proj: Project | null) => void;
  createProject: (name: string, key: string, description: string, color: string) => void;

  // Tasks & Filtering
  tasks: Task[];
  visibleTasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterAssignee: string;
  setFilterAssignee: (assigneeId: string) => void;
  
  // Task Actions
  moveTask: (taskId: string, targetStatus: TaskStatus, targetIndex?: number) => { success: boolean; reason?: string };
  createTask: (taskData: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'activity' | 'comments' | 'order'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addComment: (taskId: string, text: string) => void;
  updateTesterVerdict: (taskId: string, passed: boolean, notes: string) => void;

  // Workflow Rules
  workflowRules: WorkflowTransitionRule[];
  updateWorkflowRule: (from: TaskStatus, to: TaskStatus, allowed: boolean) => void;
  columns: ColumnDefinition[];
  
  // Views
  activeView: 'board' | 'list' | 'rules' | 'members';
  setActiveView: (view: 'board' | 'list' | 'rules' | 'members') => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Selected Task for Details
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // Backend Synchronization
  isBackendConnected: boolean;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;

  // Reset to sample data
  resetWorkspaceData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'supapulse_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user_id`);
    const found = users.find(u => u.id === savedId);
    return found || users[0]; // default to Admin
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}teams`);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [currentTeam, setCurrentTeam] = useState<Team>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_team_id`);
    const found = teams.find(t => t.id === savedId);
    if (found && (currentUser.role === 'Admin' || currentUser.teamIds.includes(found.id))) {
      return found;
    }
    const defaultForUser = teams.find(t => currentUser.teamIds.includes(t.id));
    return defaultForUser || teams[0];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [workflowRules, setWorkflowRules] = useState<WorkflowTransitionRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}rules`);
    return saved ? JSON.parse(saved) : DEFAULT_WORKFLOW_RULES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeView, setActiveView] = useState<'board' | 'list' | 'rules' | 'members'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  // Backend GraphQL synchronization state
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Synchronize full workspace state from GraphQL backend
  const syncFromBackend = async () => {
    try {
      const [teamsRes, usersRes, rulesRes, notifsRes] = await Promise.all([
        fetchGraphQL<{ myTeams: Team[] }>(MY_TEAMS_QUERY),
        fetchGraphQL<{ users: User[] }>(USERS_QUERY),
        fetchGraphQL<{ workflowRules: any[] }>(WORKFLOW_RULES_QUERY),
        fetchGraphQL<{ notifications: any[] }>(NOTIFICATIONS_QUERY),
      ]);

      if (teamsRes?.myTeams?.length) {
        setTeams(teamsRes.myTeams);
      }
      if (usersRes?.users?.length) {
        setUsers(usersRes.users);
      }
      if (rulesRes?.workflowRules?.length) {
        setWorkflowRules(rulesRes.workflowRules.map(r => ({
          ...r,
          from: r.fromStatus.toLowerCase(),
          to: r.toStatus.toLowerCase(),
        })));
      }
      if (notifsRes?.notifications?.length) {
        setNotifications(notifsRes.notifications);
      }

      // Synchronize team projects and tasks
      if (currentTeam?.id) {
        const [projRes, tasksRes] = await Promise.all([
          fetchGraphQL<{ projects: Project[] }>(PROJECTS_QUERY, { teamId: currentTeam.id }),
          fetchGraphQL<{ tasks: any[] }>(TASKS_QUERY, { teamId: currentTeam.id }),
        ]);

        if (projRes?.projects?.length) {
          setProjects(prev => {
            const others = prev.filter(p => p.teamId !== currentTeam.id);
            return [...others, ...projRes.projects];
          });
        }
        if (tasksRes?.tasks?.length) {
          setTasks(prev => {
            const others = prev.filter(t => t.teamId !== currentTeam.id);
            const mapped = tasksRes.tasks.map(t => ({
              ...t,
              status: t.status.toLowerCase(),
              priority: t.priority.toLowerCase(),
            }));
            return [...others, ...mapped];
          });
        }
      }
    } catch (err) {
      console.warn('Backend sync failed, maintaining local state:', err);
    }
  };

  useEffect(() => {
    checkBackendHealth().then(connected => {
      setIsBackendConnected(connected);
      if (connected) {
        showToast('success', 'GraphQL Synchronized', 'Connected to NestJS backend on http://localhost:4000/graphql');
        syncFromBackend();
      }
    });
    const interval = setInterval(() => {
      checkBackendHealth().then(connected => {
        setIsBackendConnected(connected);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // When active team changes, synchronize that team's tasks and projects from GraphQL
  useEffect(() => {
    if (isBackendConnected && currentTeam?.id) {
      Promise.all([
        fetchGraphQL<{ projects: Project[] }>(PROJECTS_QUERY, { teamId: currentTeam.id }),
        fetchGraphQL<{ tasks: any[] }>(TASKS_QUERY, { teamId: currentTeam.id }),
      ]).then(([projRes, tasksRes]) => {
        if (projRes?.projects?.length) {
          setProjects(prev => {
            const others = prev.filter(p => p.teamId !== currentTeam.id);
            return [...others, ...projRes.projects];
          });
        }
        if (tasksRes?.tasks?.length) {
          setTasks(prev => {
            const others = prev.filter(t => t.teamId !== currentTeam.id);
            const mapped = tasksRes.tasks.map(t => ({
              ...t,
              status: t.status.toLowerCase(),
              priority: t.priority.toLowerCase(),
            }));
            return [...others, ...mapped];
          });
        }
      }).catch(err => console.warn('Team data sync error:', err));
    }
  }, [currentTeam?.id, isBackendConnected]);

  // Login handler with backend GraphQL and offline fallback
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      if (isBackendConnected) {
        const res = await fetchGraphQL<{ login: { accessToken: string; user: User } }>(LOGIN_MUTATION, {
          input: { email, password: pass },
        });
        if (res?.login) {
          setStoredToken(res.login.accessToken);
          setCurrentUser(res.login.user);
          await syncFromBackend();
          showToast('success', 'Authenticated', `Welcome back, ${res.login.user.name}`);
          return true;
        }
      }
    } catch (e: any) {
      console.warn('Backend login attempt failed:', e);
    }

    // Fallback to local accounts
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (matched) {
      switchUser(matched.id);
      showToast('success', 'Logged In', `Authenticated as ${matched.name} (${matched.role}).`);
      return true;
    }
    showToast('error', 'Login Failed', 'Invalid credentials.');
    return false;
  };

  // Signup handler with backend GraphQL and local fallback
  const signup = async (name: string, email: string, pass: string, role: UserRole = 'Member'): Promise<boolean> => {
    try {
      if (isBackendConnected) {
        const res = await fetchGraphQL<{ signup: { accessToken: string; user: User } }>(SIGNUP_MUTATION, {
          input: { name, email, password: pass, role },
        });
        if (res?.signup) {
          setStoredToken(res.signup.accessToken);
          setCurrentUser(res.signup.user);
          setUsers(prev => [...prev.filter(u => u.id !== res.signup.user.id), res.signup.user]);
          await syncFromBackend();
          showToast('success', 'Account Created', `Welcome to SupaPulse, ${res.signup.user.name}!`);
          return true;
        }
      }
    } catch (e: any) {
      console.warn('Backend signup error:', e);
      showToast('error', 'Sign Up Error', e.message || 'Could not register user');
      return false;
    }

    // Fallback: create local user
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role,
      teamIds: ['team_eng'],
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('success', 'Account Created', `Welcome to SupaPulse, ${newUser.name}!`);
    return true;
  };

  // Logout handler
  const logout = () => {
    setStoredToken(null);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user_id`);
    const defaultUser = users[0] || INITIAL_USERS[0];
    setCurrentUser(defaultUser);
    setSelectedTask(null);
    showToast('info', 'Logged Out', 'You have been signed out.');
    setIsAuthModalOpen(true);
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}rules`, JSON.stringify(workflowRules));
  }, [workflowRules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user_id`, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_team_id`, currentTeam.id);
  }, [currentTeam]);

  // Derived: Teams accessible to current user (Strict isolation check)
  const userTeams = useMemo(() => {
    if (currentUser.role === 'Admin') {
      return teams; // Admin has global oversight across all teams
    }
    return teams.filter(t => currentUser.teamIds.includes(t.id));
  }, [currentUser, teams]);

  // Derived: Projects belonging strictly to current active team
  const teamProjects = useMemo(() => {
    return projects.filter(p => p.teamId === currentTeam.id);
  }, [projects, currentTeam]);

  // Ensure current team is valid for current user
  useEffect(() => {
    const hasAccess = currentUser.role === 'Admin' || currentUser.teamIds.includes(currentTeam.id);
    if (!hasAccess) {
      // Auto-fallback to the user's first available team
      const fallbackTeam = teams.find(t => currentUser.teamIds.includes(t.id));
      if (fallbackTeam) {
        setCurrentTeam(fallbackTeam);
        setCurrentProject(null);
        showToast('info', 'Team Switch', `Switched to ${fallbackTeam.name} based on membership.`);
      }
    }
  }, [currentUser, currentTeam, teams]);

  // If selected task is open, sync its state when tasks update
  useEffect(() => {
    if (selectedTask) {
      const refreshed = tasks.find(t => t.id === selectedTask.id);
      if (refreshed) {
        setSelectedTask(refreshed);
      }
    }
  }, [tasks]);

  // Switch User (Simulate auth login / quick-switch for testing)
  const switchUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setCurrentUser(targetUser);
    setSelectedTask(null);

    // If new user doesn't belong to current team, switch to their primary team
    if (targetUser.role !== 'Admin' && !targetUser.teamIds.includes(currentTeam.id)) {
      const primaryTeam = teams.find(t => targetUser.teamIds.includes(t.id));
      if (primaryTeam) {
        setCurrentTeam(primaryTeam);
        setCurrentProject(null);
      }
    }

    showToast(
      'info', 
      'User Switched', 
      `Logged in as ${targetUser.name} (${targetUser.role}). Team isolation is now active.`
    );
  };

  // Switch Team (Validates team boundary)
  const switchTeam = (teamId: string): boolean => {
    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam) return false;

    // Boundary check
    if (currentUser.role !== 'Admin' && !currentUser.teamIds.includes(teamId)) {
      showToast(
        'error', 
        'Access Denied (Team Isolation)', 
        `You are not a member of ${targetTeam.name}. Team data is strictly private.`
      );
      return false;
    }

    setCurrentTeam(targetTeam);
    setCurrentProject(null); // reset project filter
    setSelectedTask(null);
    return true;
  };

  // Create Team
  const createTeam = (name: string, description: string, color: string) => {
    const newTeam: Team = {
      id: 'team_' + Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description,
      icon: 'Layers',
      color,
      memberIds: [currentUser.id]
    };
    setTeams(prev => [...prev, newTeam]);

    // Add current user to this team
    setUsers(prev => prev.map(u => 
      u.id === currentUser.id ? { ...u, teamIds: [...u.teamIds, newTeam.id] } : u
    ));
    setCurrentUser(prev => ({ ...prev, teamIds: [...prev.teamIds, newTeam.id] }));

    setCurrentTeam(newTeam);
    showToast('success', 'Team Created', `Team "${name}" is now ready.`);
  };

  // Team Membership
  const addTeamMember = (teamId: string, userId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId && !t.memberIds.includes(userId)) {
        return { ...t, memberIds: [...t.memberIds, userId] };
      }
      return t;
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === userId && !u.teamIds.includes(teamId)) {
        return { ...u, teamIds: [...u.teamIds, teamId] };
      }
      return u;
    }));

    const member = users.find(u => u.id === userId);
    showToast('success', 'Member Added', `${member?.name || 'User'} was added to the team.`);
  };

  const removeTeamMember = (teamId: string, userId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, memberIds: t.memberIds.filter(id => id !== userId) };
      }
      return t;
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, teamIds: u.teamIds.filter(id => id !== teamId) };
      }
      return u;
    }));

    showToast('info', 'Member Removed', 'User removed from team roster.');
  };

  // Create Project
  const createProject = (name: string, key: string, description: string, color: string) => {
    const newProject: Project = {
      id: 'proj_' + Date.now(),
      teamId: currentTeam.id,
      name,
      key: key.toUpperCase(),
      description,
      color,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [...prev, newProject]);
    showToast('success', 'Project Created', `Project "${name}" added to ${currentTeam.name}.`);
  };

  // Task Transitions & Drag-Drop Validation
  const moveTask = (taskId: string, targetStatus: TaskStatus, targetIndex?: number): { success: boolean; reason?: string } => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, reason: 'Task not found' };

    // If status isn't changing, just reordering within the same column
    if (task.status === targetStatus) {
      if (targetIndex !== undefined) {
        setTasks(prev => {
          const colTasks = prev.filter(t => t.teamId === currentTeam.id && t.status === targetStatus);
          const otherTasks = prev.filter(t => t.id !== taskId);
          const targetTask = { ...task, order: targetIndex };
          return [...otherTasks, targetTask];
        });
      }
      return { success: true };
    }

    // CHECK WORKFLOW TRANSITION RULES
    const rule = workflowRules.find(r => r.from === task.status && r.to === targetStatus);

    // If no explicit rule or allowed is false
    if (rule && !rule.allowed) {
      const msg = `Transition from "${COLUMNS.find(c => c.id === task.status)?.title}" to "${COLUMNS.find(c => c.id === targetStatus)?.title}" is disabled by team workflow policy: ${rule.description}`;
      showToast('error', 'Workflow Rule Blocked', msg);
      return { success: false, reason: msg };
    }

    // Check Role Restrictions if specified on rule
    if (rule?.requiredRole && rule.requiredRole.length > 0) {
      const userHasRole = rule.requiredRole.includes(currentUser.role) || currentUser.role === 'Admin';
      if (!userHasRole) {
        const msg = `Only users with roles [${rule.requiredRole.join(', ')}] can transition tasks to "${COLUMNS.find(c => c.id === targetStatus)?.title}". Your role is ${currentUser.role}.`;
        showToast('warning', 'Role Permission Required', msg);
        return { success: false, reason: msg };
      }
    }

    // Special Tester Workflow Note Check:
    // If moving to 'failed', tester is encouraged to leave notes
    const activityItem = {
      id: 'act_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `changed status from ${task.status.replace('_', ' ')} to ${targetStatus.replace('_', ' ')}`,
      timestamp: new Date().toISOString(),
      fromStatus: task.status,
      toStatus: targetStatus
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: targetStatus,
          order: targetIndex !== undefined ? targetIndex : t.order,
          updatedAt: new Date().toISOString(),
          activity: [activityItem, ...t.activity]
        };
      }
      return t;
    }));

    // Always dispatch GraphQL mutation API request to backend so it runs in network settings
    fetchGraphQL(MOVE_TASK_MUTATION, {
      input: {
        taskId,
        targetStatus: targetStatus.toUpperCase(),
        targetIndex: targetIndex || 0,
      },
    })
      .then(() => setIsBackendConnected(true))
      .catch(err => console.warn('GraphQL move sync notice:', err));

    // Trigger Notification for relevant team members
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: task.reporterId || 'usr_admin',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      title: targetStatus === 'failed' ? 'Task QA Rejected' : `Task moved to ${COLUMNS.find(c => c.id === targetStatus)?.title}`,
      message: `${currentUser.name} (${currentUser.role}) moved ${task.code}: "${task.title}" to ${COLUMNS.find(c => c.id === targetStatus)?.title}.`,
      taskId: task.id,
      teamId: currentTeam.id,
      type: targetStatus === 'failed' ? 'testing_failed' : targetStatus === 'completed' ? 'completed' : 'status_change',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(
      targetStatus === 'failed' ? 'warning' : 'success', 
      'Status Updated', 
      `${task.code} is now "${COLUMNS.find(c => c.id === targetStatus)?.title}".`
    );

    return { success: true };
  };

  // Create Task
  const createTask = (taskData: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'activity' | 'comments' | 'order'>): Task => {
    const project = projects.find(p => p.id === taskData.projectId);
    const prefix = project?.key || 'TASK';
    const count = tasks.filter(t => t.projectId === taskData.projectId).length + 101;
    const code = `${prefix}-${count}`;

    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      code,
      teamId: currentTeam.id,
      subtasks: taskData.subtasks || [],
      comments: [],
      activity: [
        {
          id: 'act_' + Date.now(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'created this task',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0
    };

    setTasks(prev => [newTask, ...prev]);

    // Always dispatch GraphQL mutation API request to backend
    fetchGraphQL(CREATE_TASK_MUTATION, {
      input: {
        title: newTask.title,
        description: newTask.description,
        teamId: newTask.teamId,
        projectId: newTask.projectId,
        status: newTask.status.toUpperCase(),
        priority: newTask.priority.toUpperCase(),
        assigneeId: newTask.assigneeId,
        tags: newTask.tags,
      },
    })
      .then(() => setIsBackendConnected(true))
      .catch(err => console.warn('GraphQL task creation sync notice:', err));

    // Send assignment notification if assigned to someone else
    if (newTask.assigneeId && newTask.assigneeId !== currentUser.id) {
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: newTask.assigneeId,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        title: 'New Task Assignment',
        message: `You were assigned to ${newTask.code}: "${newTask.title}" in ${currentTeam.name}.`,
        taskId: newTask.id,
        teamId: currentTeam.id,
        type: 'assignment',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast('success', 'Task Created', `Created ${newTask.code}: ${newTask.title}`);
    return newTask;
  };

  // Update Task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    showToast('info', 'Task Updated', 'Task details were saved.');
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    showToast('info', 'Task Deleted', `Deleted ${task?.code || 'task'}.`);
  };

  // Toggle Subtask
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(s => 
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return {
          ...t,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  // Add Subtask
  const addSubtask = (taskId: string, title: string) => {
    const newSub: Subtask = {
      id: 'sub_' + Date.now(),
      title,
      completed: false
    };
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...t.subtasks, newSub],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  // Add Comment
  const addComment = (taskId: string, text: string) => {
    if (!text.trim()) return;

    const newComment = {
      id: 'c_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      text,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [...t.comments, newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    showToast('success', 'Comment Added', 'Your comment was posted.');
  };

  // Tester Verdict Update (Quick Pass / Fail)
  const updateTesterVerdict = (taskId: string, passed: boolean, notes: string) => {
    const targetStatus: TaskStatus = passed ? 'completed' : 'failed';
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const activityItem = {
      id: 'act_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: passed 
        ? `passed QA testing and verified Completed (Verdict: APPROVED)` 
        : `failed QA verification and marked Failed (Verdict: REJECTED)`,
      timestamp: new Date().toISOString(),
      fromStatus: task.status,
      toStatus: targetStatus
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: targetStatus,
          testerNotes: notes || t.testerNotes,
          testerId: currentUser.id,
          activity: [activityItem, ...t.activity],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    // Notification
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: task.assigneeId || task.reporterId,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      title: passed ? 'QA Approved: Task Completed' : 'QA Defect: Task Rejected',
      message: `${currentUser.name} (${currentUser.role}) ${passed ? 'approved' : 'rejected'} ${task.code}. Note: "${notes}"`,
      taskId: task.id,
      teamId: currentTeam.id,
      type: passed ? 'completed' : 'testing_failed',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    // Always dispatch GraphQL mutation API request to backend
    fetchGraphQL(SUBMIT_TESTER_VERDICT_MUTATION, {
      input: {
        taskId: task.id,
        passed,
        notes: notes || '',
      },
    })
      .then(() => setIsBackendConnected(true))
      .catch(err => console.warn('GraphQL tester verdict sync notice:', err));

    showToast(
      passed ? 'success' : 'error', 
      passed ? 'QA Check Passed' : 'QA Check Failed', 
      `${task.code} marked as ${passed ? 'Completed' : 'Failed / Rejected'}.`
    );
  };

  // Update Workflow Rule
  const updateWorkflowRule = (from: TaskStatus, to: TaskStatus, allowed: boolean) => {
    setWorkflowRules(prev => prev.map(r => {
      if (r.from === from && r.to === to) {
        return { ...r, allowed };
      }
      return r;
    }));

    // Always dispatch GraphQL mutation API request to backend
    fetchGraphQL(UPDATE_WORKFLOW_RULE_MUTATION, {
      input: {
        fromStatus: from.toUpperCase(),
        toStatus: to.toUpperCase(),
        allowed,
      },
    })
      .then(() => setIsBackendConnected(true))
      .catch(err => console.warn('GraphQL workflow rule sync notice:', err));

    showToast('info', 'Rule Updated', `Rule from ${from} -> ${to} is now ${allowed ? 'Allowed' : 'Disabled'}.`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('info', 'Notifications Cleared', 'All notifications marked as read.');
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read && (currentUser.role === 'Admin' || n.teamId === currentTeam.id)).length;
  }, [notifications, currentUser, currentTeam]);

  // Derived: Filtered Tasks STRICTLY by current active team (ISOLATION GUARANTEE!)
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Strict Team Boundary
      if (task.teamId !== currentTeam.id) return false;

      // 2. Project Filter
      if (currentProject && task.projectId !== currentProject.id) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCode = task.code.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesTags = task.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCode && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 4. Priority Filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      // 5. Assignee Filter
      if (filterAssignee !== 'all' && task.assigneeId !== filterAssignee) return false;

      return true;
    });
  }, [tasks, currentTeam, currentProject, searchQuery, filterPriority, filterAssignee]);

  // Reset workspace
  const resetWorkspaceData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setTeams(INITIAL_TEAMS);
    setCurrentTeam(INITIAL_TEAMS[0]);
    setProjects(INITIAL_PROJECTS);
    setCurrentProject(null);
    setTasks(INITIAL_TASKS);
    setWorkflowRules(DEFAULT_WORKFLOW_RULES);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('success', 'Reset Complete', 'Workspace reset to default Supabase template.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        login,
        signup,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        syncFromBackend,
        teams,
        currentTeam,
        userTeams,
        switchTeam,
        createTeam,
        addTeamMember,
        removeTeamMember,
        projects,
        teamProjects,
        currentProject,
        setCurrentProject,
        createProject,
        tasks,
        visibleTasks,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterAssignee,
        setFilterAssignee,
        moveTask,
        createTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        addComment,
        updateTesterVerdict,
        workflowRules,
        updateWorkflowRule,
        columns: COLUMNS,
        activeView,
        setActiveView,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        selectedTask,
        setSelectedTask,
        isBackendConnected,
        toasts,
        showToast,
        dismissToast,
        resetWorkspaceData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
