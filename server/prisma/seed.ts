import { PrismaClient, Role, TaskStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SupaPulse Database Seeding...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const demoHashedPassword = await bcrypt.hash('demo123', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@supapulse.io' },
    update: {},
    create: {
      id: 'usr_admin',
      email: 'admin@supapulse.io',
      password: hashedPassword,
      name: 'Alex Vance (Lead Admin)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: Role.Admin,
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.j@supapulse.io' },
    update: {},
    create: {
      id: 'usr_sarah',
      email: 'sarah.j@supapulse.io',
      password: demoHashedPassword,
      name: 'Sarah Jenkins (Fullstack Dev)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: Role.Member,
    },
  });

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus.qa@supapulse.io' },
    update: {},
    create: {
      id: 'usr_marcus',
      email: 'marcus.qa@supapulse.io',
      password: demoHashedPassword,
      name: 'Marcus Brody (Lead QA / Tester)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: Role.Tester,
    },
  });

  const elena = await prisma.user.upsert({
    where: { email: 'elena.design@supapulse.io' },
    update: {},
    create: {
      id: 'usr_elena',
      email: 'elena.design@supapulse.io',
      password: demoHashedPassword,
      name: 'Elena Rostova (UI/UX Architect)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: Role.Member,
    },
  });

  const david = await prisma.user.upsert({
    where: { email: 'david.infra@supapulse.io' },
    update: {},
    create: {
      id: 'usr_david',
      email: 'david.infra@supapulse.io',
      password: demoHashedPassword,
      name: 'David Chen (DevOps & Security)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: Role.Member,
    },
  });

  console.log('✅ Users seeded: Alex Vance (Admin), Sarah (Dev), Marcus (QA), Elena (Design), David (Infra)');

  // 2. Create Teams
  const teamEng = await prisma.team.upsert({
    where: { slug: 'core-eng' },
    update: {},
    create: {
      id: 'team_eng',
      name: 'Core Engineering',
      slug: 'core-eng',
      description: 'High-performance backend engines, real-time sync, and distributed APIs.',
      color: '#3ecf8e',
      icon: 'Cpu',
      members: {
        create: [
          { userId: admin.id, role: Role.Admin },
          { userId: sarah.id, role: Role.Member },
          { userId: marcus.id, role: Role.Tester },
        ],
      },
    },
  });

  const teamDesign = await prisma.team.upsert({
    where: { slug: 'design-ux' },
    update: {},
    create: {
      id: 'team_design',
      name: 'Product Design & UX',
      slug: 'design-ux',
      description: 'Design tokens, Asana-inspired Kanban canvas, and high-fidelity micro-interactions.',
      color: '#a855f7',
      icon: 'Palette',
      members: {
        create: [
          { userId: admin.id, role: Role.Admin },
          { userId: elena.id, role: Role.Member },
        ],
      },
    },
  });

  const teamPlatform = await prisma.team.upsert({
    where: { slug: 'platform-infra' },
    update: {},
    create: {
      id: 'team_platform',
      name: 'Platform & Security',
      slug: 'platform-infra',
      description: 'PostgreSQL clusters, Row-Level-Security (RLS) policies, and edge networks.',
      color: '#3b82f6',
      icon: 'ShieldCheck',
      members: {
        create: [
          { userId: admin.id, role: Role.Admin },
          { userId: david.id, role: Role.Member },
        ],
      },
    },
  });

  const teamQA = await prisma.team.upsert({
    where: { slug: 'qa-testing' },
    update: {},
    create: {
      id: 'team_qa',
      name: 'QA & Testing Guild',
      slug: 'qa-testing',
      description: 'End-to-end chaos engineering, automated testing pipelines, and release gates.',
      color: '#f59e0b',
      icon: 'CheckCircle2',
      members: {
        create: [
          { userId: admin.id, role: Role.Admin },
          { userId: marcus.id, role: Role.Tester },
        ],
      },
    },
  });

  console.log('✅ Teams & Memberships seeded with strict multi-tenant boundary.');

  // 3. Create Projects
  const projSync = await prisma.project.upsert({
    where: { id: 'proj_sync' },
    update: {},
    create: {
      id: 'proj_sync',
      teamId: teamEng.id,
      name: 'Supabase Realtime Sync Engine',
      key: 'ENG',
      description: 'Real-time WebSocket CDC protocol with sub-millisecond broadcast replication.',
      color: '#3ecf8e',
    },
  });

  const projAuth = await prisma.project.upsert({
    where: { id: 'proj_auth' },
    update: {},
    create: {
      id: 'proj_auth',
      teamId: teamEng.id,
      name: 'Multi-Tenant Auth v3',
      key: 'AUTH',
      description: 'Zero-trust JWT sessions, SAML SSO, and granular role enforcement.',
      color: '#10b981',
    },
  });

  const projUI = await prisma.project.upsert({
    where: { id: 'proj_ui' },
    update: {},
    create: {
      id: 'proj_ui',
      teamId: teamDesign.id,
      name: 'Asana Canvas Design System',
      key: 'DS',
      description: 'Figma tokens translated to Tailwind CSS with sleek glassmorphism.',
      color: '#a855f7',
    },
  });

  console.log('✅ Projects seeded.');

  // 4. Create Initial Tasks
  await prisma.task.upsert({
    where: { code: 'ENG-101' },
    update: {},
    create: {
      id: 'task_1',
      code: 'ENG-101',
      title: 'Implement WebSocket backoff jitter for Realtime cluster',
      description: 'Ensure client reconnect loop implements exponential backoff with full jitter.',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      teamId: teamEng.id,
      projectId: projSync.id,
      assigneeId: sarah.id,
      reporterId: admin.id,
      testerId: marcus.id,
      dueDate: new Date('2026-11-24'),
      tags: ['Realtime', 'WebSockets', 'Resilience'],
      subtasks: {
        create: [
          { title: 'Add exponential backoff calculation function', completed: true },
          { title: 'Add decorrelated jitter algorithm', completed: true },
          { title: 'Unit test reconnect sequence with MockSocket', completed: false },
        ],
      },
    },
  });

  await prisma.task.upsert({
    where: { code: 'ENG-102' },
    update: {},
    create: {
      id: 'task_2',
      code: 'ENG-102',
      title: 'PostgreSQL logical replication slot failover test',
      description: 'Verify seamless WAL replication slot synchronization.',
      status: TaskStatus.TESTING,
      priority: Priority.URGENT,
      teamId: teamEng.id,
      projectId: projSync.id,
      assigneeId: sarah.id,
      reporterId: admin.id,
      testerId: marcus.id,
      dueDate: new Date('2026-11-20'),
      tags: ['Database', 'WAL', 'HA'],
      testerNotes: 'Staging run in progress. Replication lag is < 5ms.',
    },
  });

  await prisma.task.upsert({
    where: { code: 'ENG-104' },
    update: {},
    create: {
      id: 'task_4',
      code: 'ENG-104',
      title: 'Redis JWT Revocation Blocklist Cache',
      description: 'Implement distributed bloom filter and token revocation check.',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      teamId: teamEng.id,
      projectId: projAuth.id,
      assigneeId: sarah.id,
      reporterId: admin.id,
      testerId: marcus.id,
      dueDate: new Date('2026-11-15'),
      tags: ['Auth', 'Security', 'Redis'],
      testerNotes: 'OWASP ZAP verified. Replay blocked.',
    },
  });

  await prisma.task.upsert({
    where: { code: 'ENG-105' },
    update: {},
    create: {
      id: 'task_5',
      code: 'ENG-105',
      title: 'Fix race condition during concurrent workspace invite acceptance',
      description: 'When two users click invite links simultaneously, unique constraint triggers an unhandled 500 error.',
      status: TaskStatus.FAILED,
      priority: Priority.URGENT,
      teamId: teamEng.id,
      projectId: projAuth.id,
      assigneeId: sarah.id,
      reporterId: admin.id,
      testerId: marcus.id,
      dueDate: new Date('2026-11-17'),
      tags: ['Bug', 'Concurrency', 'Auth'],
      testerNotes: 'FAILED TEST: k6 script still showed 3 unhandled 500 errors during burst test.',
    },
  });

  console.log('✅ Tasks seeded with Pending, In Progress, Testing, Completed, and Failed states.');
  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
