import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Subtask, Comment, Activity } from './models/task.model';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput, MoveTaskInput, TesterVerdictInput, AddCommentInput } from './dto/update-task.input';
import { WorkflowService } from '../workflow/workflow.service';
import { TeamsService } from '../teams/teams.service';
import { TaskStatus, Priority, Role } from '../common/enums';

export const INITIAL_TASKS_DATA: Task[] = [
  {
    id: 'task_1',
    code: 'ENG-101',
    title: 'Implement WebSocket backoff jitter for Realtime cluster',
    description: 'Ensure client reconnect loop implements exponential backoff with full jitter to avoid thundering herd on server restart.',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    teamId: 'team_eng',
    projectId: 'proj_sync',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: new Date('2026-11-24'),
    tags: ['Realtime', 'WebSockets', 'Resilience'],
    subtasks: [
      { id: 'sub_1', title: 'Add exponential backoff calculation function', completed: true },
      { id: 'sub_2', title: 'Add decorrelated jitter algorithm', completed: true },
      { id: 'sub_3', title: 'Unit test reconnect sequence with MockSocket', completed: false },
    ],
    comments: [
      {
        id: 'c_1',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'Sarah, make sure to simulate high latency (400ms+) when running local stress scripts.',
        createdAt: new Date('2026-11-16T10:15:00Z'),
      },
    ],
    activity: [
      { id: 'act_1', userId: 'usr_sarah', userName: 'Sarah Jenkins', action: 'moved task to In Progress', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.IN_PROGRESS, timestamp: new Date('2026-11-16T09:00:00Z') },
    ],
    order: 0,
    createdAt: new Date('2026-11-15T08:30:00Z'),
    updatedAt: new Date('2026-11-16T10:15:00Z'),
  },
  {
    id: 'task_2',
    code: 'ENG-102',
    title: 'PostgreSQL logical replication slot failover test',
    description: 'Verify seamless WAL replication slot synchronization when primary database initiates planned failover to replica.',
    status: TaskStatus.TESTING,
    priority: Priority.URGENT,
    teamId: 'team_eng',
    projectId: 'proj_sync',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: new Date('2026-11-20'),
    tags: ['Database', 'WAL', 'HA'],
    subtasks: [
      { id: 'sub_4', title: 'Configure pg_failover_slots extension', completed: true },
      { id: 'sub_5', title: 'Trigger manual Patroni switchover', completed: true },
      { id: 'sub_6', title: 'Verify zero message drop on subscriber', completed: false },
    ],
    comments: [
      {
        id: 'c_2',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'Testing currently running in Staging-2 cluster. Slot sync took 12ms!',
        createdAt: new Date('2026-11-17T09:20:00Z'),
      },
    ],
    activity: [
      { id: 'act_2', userId: 'usr_sarah', userName: 'Sarah Jenkins', action: 'moved task to Review & QA Testing', fromStatus: TaskStatus.IN_PROGRESS, toStatus: TaskStatus.TESTING, timestamp: new Date('2026-11-17T08:00:00Z') },
    ],
    testerNotes: 'Staging run in progress. Replication lag is < 5ms. Awaiting final chaos monkey test.',
    order: 0,
    createdAt: new Date('2026-11-14T11:00:00Z'),
    updatedAt: new Date('2026-11-17T09:20:00Z'),
  },
  {
    id: 'task_4',
    code: 'ENG-104',
    title: 'Redis JWT Revocation Blocklist Cache',
    description: 'Implement distributed bloom filter and token revocation check on every authenticated GraphQL query.',
    status: TaskStatus.COMPLETED,
    priority: Priority.HIGH,
    teamId: 'team_eng',
    projectId: 'proj_auth',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: new Date('2026-11-15'),
    tags: ['Auth', 'Security', 'Redis'],
    subtasks: [
      { id: 'sub_9', title: 'Create Redis token blacklist key structure', completed: true },
      { id: 'sub_10', title: 'Add NestJS Guard middleware check', completed: true },
      { id: 'sub_11', title: 'Perform load test with 50,000 req/s', completed: true },
    ],
    comments: [
      {
        id: 'c_3',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'All security penetration and load tests passed with flying colors. Marking completed!',
        createdAt: new Date('2026-11-15T16:00:00Z'),
      },
    ],
    activity: [
      { id: 'act_4', userId: 'usr_marcus', userName: 'Marcus Brody', action: 'verified and completed task', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.COMPLETED, timestamp: new Date('2026-11-15T16:00:00Z') },
    ],
    testerNotes: 'Verified with OWASP ZAP token replay test. Tokens reliably rejected in under 1.2ms.',
    order: 0,
    createdAt: new Date('2026-11-10T10:00:00Z'),
    updatedAt: new Date('2026-11-15T16:00:00Z'),
  },
  {
    id: 'task_5',
    code: 'ENG-105',
    title: 'Fix race condition during concurrent workspace invite acceptance',
    description: 'When two users click invite links simultaneously, unique constraint triggers an unhandled 500 error.',
    status: TaskStatus.FAILED,
    priority: Priority.URGENT,
    teamId: 'team_eng',
    projectId: 'proj_auth',
    assigneeId: 'usr_sarah',
    reporterId: 'usr_admin',
    testerId: 'usr_marcus',
    dueDate: new Date('2026-11-17'),
    tags: ['Bug', 'Concurrency', 'Auth'],
    subtasks: [
      { id: 'sub_12', title: 'Reproduce with concurrent k6 script', completed: true },
      { id: 'sub_13', title: 'Add upsert with serializable isolation level', completed: false },
    ],
    comments: [
      {
        id: 'c_4',
        userId: 'usr_marcus',
        userName: 'Marcus Brody',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Tester',
        text: 'FAILED TEST: k6 script still showed 3 unhandled 500 errors during burst test. Marking Failed.',
        createdAt: new Date('2026-11-17T11:45:00Z'),
      },
    ],
    activity: [
      { id: 'act_5', userId: 'usr_marcus', userName: 'Marcus Brody', action: 'rejected and marked Failed', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.FAILED, timestamp: new Date('2026-11-17T11:45:00Z') },
    ],
    testerNotes: 'Defect reproduced in Staging environment. Logs attached: PostgreSQL Deadlock detected on workspace_members_pkey.',
    order: 0,
    createdAt: new Date('2026-11-13T13:00:00Z'),
    updatedAt: new Date('2026-11-17T11:45:00Z'),
  },
  {
    id: 'task_6',
    code: 'DS-201',
    title: 'Design high-contrast Dark Mode palette with Supabase Emerald accents',
    description: 'Refine tokens for border contrast, neutral-900 surfaces, and subtle glowing emerald borders for focused and active cards.',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    teamId: 'team_design',
    projectId: 'proj_ui',
    assigneeId: 'usr_elena',
    reporterId: 'usr_admin',
    dueDate: new Date('2026-11-22'),
    tags: ['Design System', 'Figma', 'Colors'],
    subtasks: [
      { id: 'sub_14', title: 'Audit WCAG 2.1 AAA contrast ratios', completed: true },
      { id: 'sub_15', title: 'Publish Figma styles library', completed: true },
      { id: 'sub_16', title: 'Export Tailwind color variables', completed: false },
    ],
    comments: [],
    activity: [
      { id: 'act_6', userId: 'usr_elena', userName: 'Elena Rostova', action: 'started task', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.IN_PROGRESS, timestamp: new Date('2026-11-16T11:00:00Z') },
    ],
    order: 0,
    createdAt: new Date('2026-11-15T09:00:00Z'),
    updatedAt: new Date('2026-11-16T11:00:00Z'),
  },
];

@Injectable()
export class TasksService {
  private inMemoryTasks: Task[] = [...INITIAL_TASKS_DATA];

  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowService: WorkflowService,
    private readonly teamsService: TeamsService,
  ) {}

  async findByTeam(
    teamId: string,
    projectId: string | undefined,
    userId: string,
    userRole: string,
  ): Promise<Task[]> {
    // 1. Strict Team Boundary Check
    await this.teamsService.findById(teamId, userId, userRole);

    if (this.prisma.isConnected) {
      const whereClause: any = { teamId };
      if (projectId) whereClause.projectId = projectId;

      const tasks = await this.prisma.task.findMany({
        where: whereClause,
        include: {
          subtasks: true,
          comments: { include: { user: true } },
          activity: { include: { user: true } },
        },
        orderBy: { order: 'asc' },
      });

      return tasks.map((t) => ({
        ...t,
        status: t.status as any,
        priority: t.priority as any,
        comments: t.comments.map((c) => ({
          id: c.id,
          userId: c.userId,
          userName: c.user?.name || 'User',
          userAvatar: c.user?.avatar,
          userRole: c.user?.role || 'Member',
          text: c.text,
          createdAt: c.createdAt,
        })),
        activity: t.activity.map((a) => ({
          id: a.id,
          userId: a.userId,
          userName: a.user?.name || 'User',
          action: a.action,
          fromStatus: a.fromStatus as any,
          toStatus: a.toStatus as any,
          timestamp: a.timestamp,
        })),
      }));
    }

    return this.inMemoryTasks.filter(
      (t) => t.teamId === teamId && (!projectId || t.projectId === projectId),
    );
  }

  async findById(taskId: string, userId: string, userRole: string): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === taskId);
    if (!task) throw new NotFoundException('Task not found');

    // Enforce team access
    await this.teamsService.findById(task.teamId, userId, userRole);
    return task;
  }

  async createTask(input: CreateTaskInput, creator: any): Promise<Task> {
    await this.teamsService.findById(input.teamId, creator.id, creator.role);

    const count = this.inMemoryTasks.filter((t) => t.teamId === input.teamId).length + 101;
    const code = `TASK-${count}`;

    const newTask: Task = {
      id: 'task_' + Date.now(),
      code,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      teamId: input.teamId,
      projectId: input.projectId,
      assigneeId: input.assigneeId,
      reporterId: creator.id,
      dueDate: input.dueDate,
      tags: input.tags || [],
      subtasks: (input.subtasks || []).map((s, idx) => ({
        id: `st_${Date.now()}_${idx}`,
        title: s.title,
        completed: s.completed,
      })),
      comments: [],
      activity: [
        {
          id: 'act_' + Date.now(),
          userId: creator.id,
          userName: creator.name || 'User',
          action: 'created this task',
          timestamp: new Date(),
        },
      ],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryTasks.unshift(newTask);
    return newTask;
  }

  async moveTask(input: MoveTaskInput, user: any): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === input.taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.teamsService.findById(task.teamId, user.id, user.role);

    // Validate workflow transition policy
    await this.workflowService.validateTransition(
      task.status,
      input.targetStatus,
      user.role,
      task.teamId,
    );

    const fromStatus = task.status;
    task.status = input.targetStatus;
    if (input.targetIndex !== undefined) {
      task.order = input.targetIndex;
    }
    task.updatedAt = new Date();

    const activity: Activity = {
      id: 'act_' + Date.now(),
      userId: user.id,
      userName: user.name || 'User',
      action: `moved task from ${fromStatus} to ${input.targetStatus}`,
      fromStatus,
      toStatus: input.targetStatus,
      timestamp: new Date(),
    };
    task.activity.unshift(activity);

    return task;
  }

  async submitTesterVerdict(input: TesterVerdictInput, user: any): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === input.taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.teamsService.findById(task.teamId, user.id, user.role);

    const targetStatus = input.passed ? TaskStatus.COMPLETED : TaskStatus.FAILED;

    await this.workflowService.validateTransition(
      task.status,
      targetStatus,
      user.role,
      task.teamId,
    );

    const fromStatus = task.status;
    task.status = targetStatus;
    task.testerId = user.id;
    task.testerNotes = input.notes;
    task.updatedAt = new Date();

    const verdictLabel = input.passed ? 'PASSED QA (Approved)' : 'FAILED QA (Defect Reported)';
    const activity: Activity = {
      id: 'act_' + Date.now(),
      userId: user.id,
      userName: user.name || 'Tester',
      action: `evaluated test verdict: ${verdictLabel}`,
      fromStatus,
      toStatus: targetStatus,
      timestamp: new Date(),
    };
    task.activity.unshift(activity);

    return task;
  }

  async updateTask(input: UpdateTaskInput, user: any): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === input.id);
    if (!task) throw new NotFoundException('Task not found');

    await this.teamsService.findById(task.teamId, user.id, user.role);

    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.priority !== undefined) task.priority = input.priority;
    if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId;
    if (input.dueDate !== undefined) task.dueDate = input.dueDate;
    if (input.tags !== undefined) task.tags = input.tags;
    if (input.testerNotes !== undefined) task.testerNotes = input.testerNotes;
    task.updatedAt = new Date();

    return task;
  }

  async toggleSubtask(taskId: string, subtaskId: string, user: any): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.teamsService.findById(task.teamId, user.id, user.role);

    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (sub) {
      sub.completed = !sub.completed;
      task.updatedAt = new Date();
    }
    return task;
  }

  async addComment(input: AddCommentInput, user: any): Promise<Task> {
    const task = this.inMemoryTasks.find((t) => t.id === input.taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.teamsService.findById(task.teamId, user.id, user.role);

    const comment: Comment = {
      id: 'c_' + Date.now(),
      userId: user.id,
      userName: user.name || 'User',
      userAvatar: user.avatar,
      userRole: user.role,
      text: input.text,
      createdAt: new Date(),
    };
    task.comments.push(comment);
    task.updatedAt = new Date();

    return task;
  }

  async deleteTask(taskId: string, user: any): Promise<boolean> {
    const index = this.inMemoryTasks.findIndex((t) => t.id === taskId);
    if (index === -1) return false;

    const task = this.inMemoryTasks[index];
    await this.teamsService.findById(task.teamId, user.id, user.role);

    this.inMemoryTasks.splice(index, 1);
    return true;
  }
}
