import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './models/user.model';
import { DEMO_USERS } from '../auth/auth.service';

@Injectable()
export class UsersService {
  private inMemoryUsers: User[] = [...DEMO_USERS];

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    if (this.prisma.isConnected) {
      const dbUsers = await this.prisma.user.findMany({
        include: { teamMembers: true },
      });
      return dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatar: u.avatar,
        role: u.role as any,
        teamIds: u.teamMembers.map((tm) => tm.teamId),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }));
    }
    return this.inMemoryUsers;
  }

  async findById(id: string): Promise<User | null> {
    const all = await this.findAll();
    return all.find((u) => u.id === id) || null;
  }
}
