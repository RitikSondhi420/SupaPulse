import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Team } from './models/team.model';
import { CreateTeamInput, TeamMemberInput } from './dto/create-team.input';

export const INITIAL_TEAMS_DATA: Team[] = [
  {
    id: 'team_eng',
    name: 'Core Engineering',
    slug: 'core-eng',
    description: 'High-performance backend engines, real-time sync, and distributed APIs.',
    icon: 'Cpu',
    color: '#3ecf8e',
    memberIds: ['usr_admin', 'usr_sarah', 'usr_marcus'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'team_design',
    name: 'Product Design & UX',
    slug: 'design-ux',
    description: 'Design tokens, Asana-inspired Kanban canvas, and high-fidelity micro-interactions.',
    icon: 'Palette',
    color: '#a855f7',
    memberIds: ['usr_admin', 'usr_elena'],
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: 'team_platform',
    name: 'Platform & Security',
    slug: 'platform-infra',
    description: 'PostgreSQL clusters, Row-Level-Security (RLS) policies, and edge networks.',
    icon: 'ShieldCheck',
    color: '#3b82f6',
    memberIds: ['usr_admin', 'usr_david'],
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: 'team_qa',
    name: 'QA & Testing Guild',
    slug: 'qa-testing',
    description: 'End-to-end chaos engineering, automated testing pipelines, and release gates.',
    icon: 'CheckCircle2',
    color: '#f59e0b',
    memberIds: ['usr_admin', 'usr_marcus'],
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-12'),
  },
];

@Injectable()
export class TeamsService {
  private inMemoryTeams: Team[] = [...INITIAL_TEAMS_DATA];

  constructor(private readonly prisma: PrismaService) {}

  async getUserTeams(userId: string, userRole: string): Promise<Team[]> {
    if (this.prisma.isConnected) {
      if (userRole === 'Admin') {
        const teams = await this.prisma.team.findMany({
          include: { members: true },
        });
        return teams.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          description: t.description,
          color: t.color,
          icon: t.icon,
          memberIds: t.members.map((m) => m.userId),
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
      }

      const userMemberships = await this.prisma.teamMember.findMany({
        where: { userId },
        include: { team: { include: { members: true } } },
      });

      return userMemberships.map((m) => ({
        id: m.team.id,
        name: m.team.name,
        slug: m.team.slug,
        description: m.team.description,
        color: m.team.color,
        icon: m.team.icon,
        memberIds: m.team.members.map((tm) => tm.userId),
        createdAt: m.team.createdAt,
        updatedAt: m.team.updatedAt,
      }));
    }

    // In-memory fallback
    if (userRole === 'Admin') {
      return this.inMemoryTeams;
    }
    return this.inMemoryTeams.filter((t) => t.memberIds.includes(userId));
  }

  async findById(teamId: string, userId: string, userRole: string): Promise<Team> {
    const teams = await this.getUserTeams(userId, userRole);
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
      throw new ForbiddenException(
        `Team Isolation Error: You do not have permission to view data from team ID '${teamId}'.`
      );
    }
    return team;
  }

  async createTeam(input: CreateTeamInput, creatorId: string): Promise<Team> {
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (this.prisma.isConnected) {
      const created = await this.prisma.team.create({
        data: {
          name: input.name,
          slug,
          description: input.description,
          color: input.color,
          icon: input.icon,
          members: {
            create: {
              userId: creatorId,
              role: 'Admin',
            },
          },
        },
        include: { members: true },
      });

      return {
        id: created.id,
        name: created.name,
        slug: created.slug,
        description: created.description,
        color: created.color,
        icon: created.icon,
        memberIds: created.members.map((m) => m.userId),
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
    }

    const newTeam: Team = {
      id: 'team_' + Date.now(),
      name: input.name,
      slug,
      description: input.description,
      color: input.color,
      icon: input.icon,
      memberIds: [creatorId],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryTeams.push(newTeam);
    return newTeam;
  }

  async addMember(input: TeamMemberInput): Promise<Team> {
    if (this.prisma.isConnected) {
      await this.prisma.teamMember.upsert({
        where: {
          userId_teamId: {
            userId: input.userId,
            teamId: input.teamId,
          },
        },
        create: {
          userId: input.userId,
          teamId: input.teamId,
          role: 'Member',
        },
        update: {},
      });

      const updated = await this.prisma.team.findUnique({
        where: { id: input.teamId },
        include: { members: true },
      });
      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        color: updated.color,
        icon: updated.icon,
        memberIds: updated.members.map((m) => m.userId),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    }

    const team = this.inMemoryTeams.find((t) => t.id === input.teamId);
    if (!team) throw new NotFoundException('Team not found');
    if (!team.memberIds.includes(input.userId)) {
      team.memberIds.push(input.userId);
    }
    return team;
  }

  async removeMember(input: TeamMemberInput): Promise<Team> {
    if (this.prisma.isConnected) {
      await this.prisma.teamMember.deleteMany({
        where: {
          userId: input.userId,
          teamId: input.teamId,
        },
      });

      const updated = await this.prisma.team.findUnique({
        where: { id: input.teamId },
        include: { members: true },
      });
      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        color: updated.color,
        icon: updated.icon,
        memberIds: updated.members.map((m) => m.userId),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    }

    const team = this.inMemoryTeams.find((t) => t.id === input.teamId);
    if (!team) throw new NotFoundException('Team not found');
    team.memberIds = team.memberIds.filter((id) => id !== input.userId);
    return team;
  }
}
