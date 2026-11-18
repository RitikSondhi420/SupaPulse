import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from './models/project.model';
import { CreateProjectInput } from './dto/create-project.input';
import { TeamsService } from '../teams/teams.service';

export const INITIAL_PROJECTS_DATA: Project[] = [
  {
    id: 'proj_sync',
    teamId: 'team_eng',
    name: 'Supabase Realtime Sync Engine',
    key: 'ENG',
    description: 'Real-time WebSocket CDC protocol with sub-millisecond broadcast replication.',
    color: '#3ecf8e',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'proj_auth',
    teamId: 'team_eng',
    name: 'Multi-Tenant Auth v3',
    key: 'AUTH',
    description: 'Zero-trust JWT sessions, SAML SSO, and granular role enforcement.',
    color: '#10b981',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    id: 'proj_ui',
    teamId: 'team_design',
    name: 'Asana Canvas Design System',
    key: 'DS',
    description: 'Figma tokens translated to Tailwind CSS with sleek glassmorphism and Supabase dark mode.',
    color: '#a855f7',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'proj_mobile',
    teamId: 'team_design',
    name: 'Mobile App Experience',
    key: 'MOB',
    description: 'Gestures, drag handles, and offline-first reactive cache synchronization.',
    color: '#c084fc',
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
  },
  {
    id: 'proj_pg',
    teamId: 'team_platform',
    name: 'PostgreSQL RLS Partitioning',
    key: 'DB',
    description: 'Dynamic tenant isolation schemas using automated Row Level Security policies.',
    color: '#3b82f6',
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: 'proj_e2e',
    teamId: 'team_qa',
    name: 'Automated Regression Suites',
    key: 'QA',
    description: 'Playwright & load testing framework verifying transition gate invariants.',
    color: '#f59e0b',
    createdAt: new Date('2026-02-12'),
    updatedAt: new Date('2026-02-12'),
  },
];

@Injectable()
export class ProjectsService {
  private inMemoryProjects: Project[] = [...INITIAL_PROJECTS_DATA];

  constructor(
    private readonly prisma: PrismaService,
    private readonly teamsService: TeamsService,
  ) {}

  async findByTeam(teamId: string, userId: string, userRole: string): Promise<Project[]> {
    // Check team access first (enforces tenant isolation)
    await this.teamsService.findById(teamId, userId, userRole);

    if (this.prisma.isConnected) {
      return this.prisma.project.findMany({
        where: { teamId },
      });
    }

    return this.inMemoryProjects.filter((p) => p.teamId === teamId);
  }

  async findById(id: string): Promise<Project | null> {
    if (this.prisma.isConnected) {
      return this.prisma.project.findUnique({
        where: { id },
      });
    }
    return this.inMemoryProjects.find((p) => p.id === id) || null;
  }

  async createProject(input: CreateProjectInput, userId: string, userRole: string): Promise<Project> {
    await this.teamsService.findById(input.teamId, userId, userRole);

    if (this.prisma.isConnected) {
      return this.prisma.project.create({
        data: {
          teamId: input.teamId,
          name: input.name,
          key: input.key.toUpperCase(),
          description: input.description,
          color: input.color,
        },
      });
    }

    const newProject: Project = {
      id: 'proj_' + Date.now(),
      teamId: input.teamId,
      name: input.name,
      key: input.key.toUpperCase(),
      description: input.description,
      color: input.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryProjects.push(newProject);
    return newProject;
  }
}
