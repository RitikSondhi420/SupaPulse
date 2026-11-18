# SupaPulse | Fullstack Asana & Supabase Project Management Platform

A high-performance, modern fullstack web application blending the developer-first aesthetic of **Supabase** with the rich project management workflows of **Asana**.

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite (Running at `http://localhost:5173`)
- **Backend**: NestJS, GraphQL (Apollo Server v4), PostgreSQL schema, Prisma ORM, JWT Authentication (Running at `http://localhost:4000/graphql`)

---

## ⚡ Architecture & Live Endpoints

| Service | Port | Endpoint / Playground |
| :--- | :--- | :--- |
| **Frontend Web App** | `5173` | [http://localhost:5173](http://localhost:5173) |
| **NestJS GraphQL Server** | `4000` | [http://localhost:4000](http://localhost:4000) |
| **GraphQL Interactive Playground** | `4000` | [http://localhost:4000/graphql](http://localhost:4000/graphql) |

---

## 🔑 Pre-Configured Default Admin & Role Accounts

| Name | Role | Email | Password | Accessible Teams |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Vance (Lead Admin)** | `Admin` | `admin@supapulse.io` | `admin123` | **All Teams** (Global Oversight & Policy Override) |
| **Sarah Jenkins (Fullstack Dev)** | `Member` | `sarah.j@supapulse.io` | `demo123` | **Core Engineering ONLY** |
| **Marcus Brody (Lead QA / Tester)**| `Tester` | `marcus.qa@supapulse.io` | `demo123` | **Core Engineering** & **QA Testing Guild** |
| **Elena Rostova (UI/UX Architect)**| `Member` | `elena.design@supapulse.io` | `demo123` | **Product Design & UX ONLY** |
| **David Chen (DevOps & Security)** | `Member` | `david.infra@supapulse.io` | `demo123` | **Platform & Security ONLY** |

---

## 🛡️ Multi-Tenant Team Data Isolation

The application strictly isolates data by team:
1. **Tenant Isolation**: When Sarah logs in, she can **only** query or mutate projects and tasks in `team_eng`. Attempts to fetch `team_design` data are rejected with a GraphQL `ForbiddenException`.
2. **Multi-Team Membership**: Users like Marcus belong to both `Core Engineering` and `QA Testing Guild`.
3. **Role-Based Guards**:
   - `GqlAuthGuard`: Authenticates requests via Bearer JWT token.
   - `RolesGuard`: Enforces role permissions (e.g. only Admins can alter workflow transition rules; only Testers/Admins can record QA verdicts).

---

## 📂 Backend Stack Structure (`server/`)

```
server/
├── prisma/
│   ├── schema.prisma                 # PostgreSQL schema (Users, Teams, Projects, Tasks, Subtasks, Comments, WorkflowRules)
│   └── seed.ts                       # Database seeder with pre-configured teams, tasks & admin
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   │   └── roles.decorator.ts        # @Roles(Role.Admin, Role.Tester)
│   │   ├── guards/
│   │   │   ├── gql-auth.guard.ts         # JWT GraphQL authentication guard
│   │   │   └── roles.guard.ts            # RBAC role enforcement guard
│   │   └── enums.ts                      # Role, TaskStatus, Priority registered with GraphQL
│   ├── prisma/
│   │   ├── prisma.service.ts             # Prisma client with hybrid memory-persistence fallback
│   │   └── prisma.module.ts
│   ├── auth/
│   │   ├── dto/login.input.ts            # Login GraphQL input
│   │   ├── dto/auth-payload.type.ts      # Token + User payload
│   │   ├── auth.service.ts               # Bcrypt password verification & JWT signing
│   │   ├── auth.resolver.ts              # login mutation & me query
│   │   ├── jwt.strategy.ts               # Passport JWT strategy
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── models/user.model.ts          # GraphQL User ObjectType
│   │   ├── users.service.ts
│   │   ├── users.resolver.ts             # users & user queries
│   │   └── users.module.ts
│   ├── teams/
│   │   ├── models/team.model.ts          # GraphQL Team ObjectType
│   │   ├── dto/create-team.input.ts
│   │   ├── teams.service.ts              # Strict isolation logic
│   │   ├── teams.resolver.ts             # myTeams, team, createTeam, addTeamMember
│   │   └── teams.module.ts
│   ├── projects/
│   │   ├── models/project.model.ts       # GraphQL Project ObjectType
│   │   ├── dto/create-project.input.ts
│   │   ├── projects.service.ts
│   │   ├── projects.resolver.ts          # projects & createProject
│   │   └── projects.module.ts
│   ├── tasks/
│   │   ├── models/task.model.ts          # GraphQL Task, Subtask, Comment, Activity
│   │   ├── dto/create-task.input.ts
│   │   ├── dto/update-task.input.ts      # MoveTaskInput, TesterVerdictInput, AddCommentInput
│   │   ├── tasks.service.ts              # Drag-drop reordering, status transitions, tester gates
│   │   ├── tasks.resolver.ts             # tasks, createTask, moveTask, submitTesterVerdict
│   │   └── tasks.module.ts
│   ├── workflow/
│   │   ├── models/workflow-rule.model.ts # GraphQL WorkflowRule ObjectType
│   │   ├── dto/update-workflow-rule.input.ts
│   │   ├── workflow.service.ts           # State transition matrix validator
│   │   ├── workflow.resolver.ts          # workflowRules & updateWorkflowRule
│   │   └── workflow.module.ts
│   ├── notifications/
│   │   ├── models/notification.model.ts  # GraphQL Notification ObjectType
│   │   ├── notifications.service.ts
│   │   ├── notifications.resolver.ts
│   │   └── notifications.module.ts
│   ├── app.module.ts                     # Root module integrating Apollo Server & Config
│   └── main.ts                           # Bootstraps server with CORS & ValidationPipe
├── package.json
└── tsconfig.json
```

---

## 📡 Sample GraphQL Queries & Mutations

### 1. Login Mutation
```graphql
mutation {
  login(input: { email: "admin@supapulse.io", password: "admin123" }) {
    accessToken
    user {
      id
      name
      email
      role
      teamIds
    }
  }
}
```

### 2. Query Tasks by Team (with Subtasks and Comments)
```graphql
query {
  tasks(teamId: "team_eng") {
    id
    code
    title
    status
    priority
    subtasks {
      id
      title
      completed
    }
    comments {
      userName
      text
      createdAt
    }
  }
}
```

### 3. Move Task (Validating Transition Policy)
```graphql
mutation {
  moveTask(input: {
    taskId: "task_1",
    targetStatus: TESTING,
    targetIndex: 0
  }) {
    id
    code
    status
    activity {
      action
      timestamp
    }
  }
}
```

### 4. QA Tester Verdict Submission
```graphql
mutation {
  submitTesterVerdict(input: {
    taskId: "task_2",
    passed: true,
    notes: "Verified on Staging cluster with zero replication lag."
  }) {
    id
    status
    testerNotes
  }
}
```
