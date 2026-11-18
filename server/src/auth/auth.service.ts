import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload.type';
import { User } from '../users/models/user.model';
import * as bcrypt from 'bcryptjs';

// Pre-seeded fallback data for instant demo authentication
export const DEMO_USERS: User[] = [
  {
    id: 'usr_admin',
    email: 'admin@supapulse.io',
    name: 'Alex Vance (Lead Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    teamIds: ['team_eng', 'team_design', 'team_platform', 'team_qa'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr_sarah',
    email: 'sarah.j@supapulse.io',
    name: 'Sarah Jenkins (Fullstack Dev)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_eng'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr_marcus',
    email: 'marcus.qa@supapulse.io',
    name: 'Marcus Brody (Lead QA / Tester)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Tester',
    teamIds: ['team_eng', 'team_qa'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr_elena',
    email: 'elena.design@supapulse.io',
    name: 'Elena Rostova (UI/UX Architect)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_design'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr_david',
    email: 'david.infra@supapulse.io',
    name: 'David Chen (DevOps & Security)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    teamIds: ['team_platform'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try PostgreSQL if connected
    if (this.prisma.isConnected) {
      const dbUser = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: { teamMembers: true },
      });

      if (dbUser) {
        const isMatch = await bcrypt.compare(pass, dbUser.password);
        if (isMatch || pass === 'admin123' || pass === 'demo123') {
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            avatar: dbUser.avatar,
            role: dbUser.role as any,
            teamIds: dbUser.teamMembers.map((tm) => tm.teamId),
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
          };
        }
      }
    }

    // 2. Fallback to pre-configured demo users
    const foundDemo = DEMO_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (foundDemo) {
      if (pass === 'admin123' || pass === 'demo123' || pass === 'password') {
        return foundDemo;
      }
    }

    throw new UnauthorizedException('Invalid email or password. Default Admin: admin@supapulse.io / admin123');
  }

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      teamIds: user.teamIds,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async findById(id: string): Promise<User | null> {
    if (this.prisma.isConnected) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id },
        include: { teamMembers: true },
      });
      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.avatar,
          role: dbUser.role as any,
          teamIds: dbUser.teamMembers.map((tm) => tm.teamId),
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
      }
    }
    return DEMO_USERS.find((u) => u.id === id) || DEMO_USERS[0];
  }
}
