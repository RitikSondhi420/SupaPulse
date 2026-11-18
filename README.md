# ⚡ SupaPulse — Modern Fullstack Asana & Supabase Clone

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS_10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Apollo Server](https://img.shields.io/badge/Apollo_Server_4-311C87?style=for-the-badge&logo=apollographql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A high-performance, fullstack project management platform blending the developer-first obsidian aesthetic of [Supabase](https://supabase.com) with the rich task workflows of [Asana](https://asana.com).**

[Live Client (Local)](#-quickstart-guide) • [GraphQL Playground](#-graphql-api-reference) • [Multi-Tenant Architecture](#-multi-tenant-team-data-isolation) • [Free Deployment Guide](file:///d:/learning%20(next%20,%20microservices,%20postgresql)%20project/supabase/DEPLOYMENT_GUIDE.md)

</div>

---

## 📋 Table of Contents

- [Overview & Key Highlights](#-overview--key-highlights)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
  - [1. Drag-and-Drop Kanban Board](#1-drag-and-drop-kanban-board)
  - [2. Quick Status Select Box](#2-quick-status-select-box-on-every-task)
  - [3. Configurable State Transition Rules](#3-configurable-state-transition-rules-workflow-policy)
  - [4. QA Tester Verification Gate](#4-qa-tester-verification-gate)
  - [5. Strict Multi-Tenant Team Data Isolation](#5-strict-multi-tenant-team-data-isolation)
  - [6. Real-Time Activity Notifications](#6-real-time-activity-notifications)
  - [7. Tabular Asana List View](#7-tabular-asana-list-view)
- [Pre-Configured Demo & Admin Accounts](#-pre-configured-demo--admin-accounts)
- [Tech Stack Breakdown](#-tech-stack-breakdown)
- [Repository Directory Structure](#-repository-directory-structure)
- [Quickstart Guide (Local Development)](#-quickstart-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone & Install Dependencies](#1-clone--install-dependencies)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Start the NestJS Backend](#3-start-the-nestjs-backend)
  - [4. Start the React Frontend](#4-start-the-react-frontend)
- [GraphQL API Reference](#-graphql-api-reference)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Database Schema & Prisma ORM](#-database-schema--prisma-orm)
- [100% Free Live Deployment](#-100-free-live-deployment)
- [License & Credits](#-license)

---

## 🌟 Overview & Key Highlights

**SupaPulse** is built from the ground up to solve complex enterprise project workflows while retaining lightning-fast performance and clean aesthetics:

- **End-to-End Type Safety**: Shared domain models between React TypeScript frontend, NestJS code-first GraphQL resolvers, and Prisma PostgreSQL schema.
- **Strict Data Isolation**: Multiple teams (`Core Engineering`, `Product Design & UX`, `Platform & Security`, `QA Testing Guild`) where members can only view data from their permitted teams.
- **Workflow State Governance**: An interactive state transition matrix preventing invalid jumps (e.g., tasks cannot jump from `Pending` directly to `Completed` without passing QA).
- **QA Tester Powers**: Dedicated tester review tools with pass/fail one-click gates and defect reproduction notes.
- **Instant Demo Switcher**: Pre-configured with a default Admin account (`admin@supapulse.io` / `admin123`) plus 1-click role switcher buttons to test multi-team isolation immediately.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend["React 18 + Vite (Port 5173)"]
        UI["Modern Supabase Obsidian Canvas"]
        Board["Draggable Kanban Board"]
        List["Asana Grouped Table"]
        Rules["Workflow Transition Matrix"]
        GQLClient["GraphQL Client Adapter\n(JWT Header Injection)"]
    end

    subgraph Backend["NestJS Backend (Port 4000)"]
        Apollo["Apollo Server v4\n(/graphql)"]
        AuthMod["Auth Module & JWT Strategy"]
        Guard["GqlAuthGuard & RolesGuard\n(Strict Team Isolation)"]
        Resolvers["GraphQL Resolvers\n(Tasks, Teams, Projects, Workflow)"]
        Service["Workflow Rules Engine & Validator"]
    end

    subgraph Database["Database Layer"]
        Prisma["Prisma ORM Client v5"]
        Postgres[("PostgreSQL Database\n(or Supabase Hosted Cloud)")]
    end

    UI --> GQLClient
    Board --> GQLClient
    List --> GQLClient
    Rules --> GQLClient

    GQLClient -->|"GraphQL Queries & Mutations\n(POST http://localhost:4000/graphql)"| Apollo
    Apollo --> AuthMod
    Apollo --> Guard
    Guard --> Resolvers
    Resolvers --> Service
    Service --> Prisma
    Prisma --> Postgres
```

---

## 🚀 Core Features

### 1. Drag-and-Drop Kanban Board
- **5 Workflow Columns**:
  - `Backlog / Pending` (Amber)
  - `In Progress` (Cyan)
  - `Review & QA Testing` (Purple)
  - `Completed` (Emerald)
  - `Failed / Blocked / Rejected` (Rose)
- **High-Contrast Drop Feedback**: Hovering over target columns highlights them with signature Supabase emerald dashed borders and glow indicators.
- **Reordering & Moving**: Reorder tasks within columns or drag across columns with immediate validation against transition policies.

### 2. Quick Status Select Box on Every Task
- Testers and developers can change task status directly via an inline select box on **every Kanban card**, inside the **List View**, and in the **Task Details Drawer**.
- Instant 1-click status transitions without requiring drag-and-drop.

### 3. Configurable State Transition Rules (Workflow Policy)
- Access the **Workflow Rules** tab to visually configure allowed and blocked transitions using an interactive matrix:
  - Toggle whether `Completed` tasks can be reopened back to `Pending` or `In Progress`.
  - Enforce whether tasks can skip directly from `Pending` to `Completed` without passing through `In Progress` or `QA Testing`.
  - Restrict transitions to specific roles (e.g. only `Admin` or `Tester` can mark a task as `Completed` or `Failed`).
  - Attempting an unauthorized transition displays an informative alert toast explaining the exact blocked rule.

### 4. QA Tester Verification Gate
- Dedicated QA panel on every task:
  - **Pass & Mark Completed** (Emerald button)
  - **Fail & Reject** (Rose button)
  - **Tester Notes & Defect Reproduction**: Record test environment logs, reproduction steps, or benchmark results.
  - Defect badges are rendered on the task card when a task is rejected.

### 5. Strict Multi-Tenant Team Data Isolation
- **Multiple Teams & Projects**: Supports distinct groups (`Core Engineering`, `Product Design & UX`, `Platform & Security`, `QA Testing Guild`).
- **Multi-Team Membership**: Users can belong to one or more teams simultaneously.
- **Strict Data Boundary**:
  - Sarah (`sarah.j@supapulse.io`) only sees `Core Engineering` projects and tasks. If she attempts to view `team_design` data, the system blocks the request.
  - Elena only sees `Product Design & UX`.
  - Marcus (Tester) has access to both `Core Engineering` and `QA Testing Guild`.
  - Alex Vance (`Admin`) has global oversight across all teams.

### 6. Real-Time Activity Notifications
- Notification bell with unread badge counter in the top bar.
- Popover drawer with filter tabs (**All**, **Unread**, **QA & Alerts**).
- Triggers notifications whenever tasks are assigned, moved, or rejected by QA.
- Clicking any notification opens the corresponding task directly.

### 7. Tabular Asana List View
- Compact tabular view grouped by status with collapsible sections.
- Inline editable status select-boxes, priority badges, assignee avatars, subtask progress meters, and due date indicators.

---

## 🔑 Pre-Configured Demo & Admin Accounts

You can log in or switch accounts with **1 click** using the account pill in the top-right corner to test multi-team data isolation:

| Name | Role | Email | Password | Accessible Teams |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Vance (Lead Admin)** | `Admin` | `admin@supapulse.io` | `admin123` | **All Teams** (Global Oversight & Policy Override) |
| **Sarah Jenkins (Fullstack Dev)** | `Member` | `sarah.j@supapulse.io` | `demo123` | **Core Engineering ONLY** |
| **Marcus Brody (Lead QA / Tester)**| `Tester` | `marcus.qa@supapulse.io` | `demo123` | **Core Engineering** & **QA Testing Guild** |
| **Elena Rostova (UI/UX Architect)**| `Member` | `elena.design@supapulse.io` | `demo123` | **Product Design & UX ONLY** |
| **David Chen (DevOps & Security)** | `Member` | `david.infra@supapulse.io` | `demo123` | **Platform & Security ONLY** |

---

## 💻 Tech Stack Breakdown

### Frontend (`client/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Declarative component UI library |
| **TypeScript** | `5.7.2` | Static type checking and domain interfaces |
| **Vite** | `6.0.7` | Next-generation fast frontend build tool & dev server |
| **Tailwind CSS** | `3.4.17` | Utility-first styling with Supabase dark theme tokens |
| **Lucide React** | `1.73.0` | Modern, clean icon library |

### Backend (`server/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **NestJS** | `10.4.15` | Enterprise modular backend framework |
| **GraphQL** | `16.10.0` | Strongly-typed query and mutation language |
| **Apollo Server** | `4.11.3` | High-performance GraphQL server engine |
| **Prisma ORM** | `5.22.0` | Next-generation database toolkit and migrations |
| **PostgreSQL** | `15+` | Relational database storage |
| **Passport & JWT** | `10.0.3` | Token-based authentication and role enforcement |
| **BcryptJS** | `2.4.3` | Secure password hashing |

---

## 📂 Repository Directory Structure

```
supabase/
├── client/                           # React 18 TypeScript Frontend
│   ├── src/
│   │   ├── components/               # Modular UI Components
│   │   │   ├── AuthModal.tsx         # Admin login & 1-click role switcher
│   │   │   ├── KanbanBoard.tsx       # Draggable columns & drop target feedback
│   │   │   ├── ListView.tsx          # Grouped tabular Asana-style list
│   │   │   ├── Navbar.tsx            # Header, team selector & live GraphQL badge
│   │   │   ├── NewTaskModal.tsx      # Task creation modal
│   │   │   ├── NotificationsPopover.tsx # Real-time notification center
│   │   │   ├── Sidebar.tsx           # Views navigation & accessible teams list
│   │   │   ├── TaskCard.tsx          # Draggable card with inline status selector
│   │   │   ├── TaskDetailModal.tsx   # Subtasks, comments thread, QA tester gate
│   │   │   ├── TeamMembersModal.tsx  # Multi-team roster & RBAC manager
│   │   │   ├── ToastContainer.tsx    # Real-time alert toasts
│   │   │   └── WorkflowSettings.tsx  # Interactive state transition matrix
│   │   ├── context/
│   │   │   └── AppContext.tsx        # Centralized state & GraphQL synchronization
│   │   ├── graphql/
│   │   │   ├── client.ts             # Typed GraphQL fetch client with JWT injection
│   │   │   └── operations.ts         # Query and Mutation GraphQL documents
│   │   ├── mock/
│   │   │   └── initialData.ts        # Pre-seeded teams, tasks, and users
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript domain models
│   │   ├── App.tsx                   # Main layout container
│   │   ├── index.css                 # Custom scrollbars and Tailwind styles
│   │   └── main.tsx                  # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                           # NestJS GraphQL Backend
│   ├── prisma/
│   │   ├── schema.prisma             # PostgreSQL schema (Users, Teams, Tasks, etc.)
│   │   └── seed.ts                   # Database seeder script
│   ├── src/
│   │   ├── auth/                     # JWT authentication, resolvers & guards
│   │   ├── common/                   # Decorators (@CurrentUser), guards & enums
│   │   ├── notifications/            # Notification GraphQL resolvers & services
│   │   ├── prisma/                   # Prisma database client & resilience layer
│   │   ├── projects/                 # Project resolvers & team filtering
│   │   ├── tasks/                    # Task CRUD, drag-and-drop, tester verdicts
│   │   ├── teams/                    # Multi-tenant isolation & team membership
│   │   ├── users/                    # User models & queries
│   │   ├── workflow/                 # Transition matrix governance rules engine
│   │   ├── app.module.ts             # Root NestJS module
│   │   └── main.ts                   # Server bootstrap on port 4000
│   ├── Dockerfile                    # Production container build
│   ├── package.json
│   └── tsconfig.json
│
├── DEPLOYMENT_GUIDE.md               # Step-by-step free deployment guide
├── netlify.toml                      # Netlify 1-click deploy configuration
├── render.yaml                       # Render.com infrastructure blueprint
├── vercel.json                       # Vercel deployment configuration
└── README.md                         # Main documentation
```

---

## 🛠️ Quickstart Guide (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** installed
- *(Optional)* **PostgreSQL** running locally or a free [Supabase](https://supabase.com) database URL.

---

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/supapulse.git
cd supapulse

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supapulse_db?schema=public"
JWT_SECRET="supapulse_secret_jwt_key_2026_modern_asana"
JWT_EXPIRATION="7d"
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

**Frontend (`client/.env` - optional):**
```env
VITE_GRAPHQL_ENDPOINT="http://localhost:4000/graphql"
```

---

### 3. Start the NestJS Backend

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Start in Development Watch Mode
npm run start:dev
```
*The server will boot on `http://localhost:4000` with the Apollo GraphQL Playground available at `http://localhost:4000/graphql`.*

---

### 4. Start the React Frontend

Open a new terminal window:
```bash
cd client
npm run dev
```
*The web app will launch at `http://localhost:5173`.*

---

## 📡 GraphQL API Reference

Once the backend is running, open **`http://localhost:4000/graphql`** to interact with the API.

### Queries

#### 1. Fetch User Accessible Teams (Strict Isolation)
```graphql
query GetMyTeams {
  myTeams {
    id
    name
    slug
    color
    memberIds
  }
}
```

#### 2. Fetch Tasks by Team
```graphql
query GetTeamTasks($teamId: ID!) {
  tasks(teamId: $teamId) {
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
    testerNotes
  }
}
```

---

### Mutations

#### 1. Sign In
```graphql
mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
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

#### 2. Move Task Status (Validating Workflow Rules)
```graphql
mutation MoveTask($taskId: ID!, $targetStatus: TaskStatus!) {
  moveTask(input: {
    taskId: $taskId,
    targetStatus: $targetStatus,
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

#### 3. Submit QA Tester Verdict
```graphql
mutation SubmitVerdict($taskId: ID!, $passed: Boolean!, $notes: String!) {
  submitTesterVerdict(input: {
    taskId: $taskId,
    passed: $passed,
    notes: $notes
  }) {
    id
    status
    testerNotes
  }
}
```

---

## 💾 Database Schema & Prisma ORM

The PostgreSQL database schema is defined in [schema.prisma](file:///d:/learning%20(next%20,%20microservices,%20postgresql)%20project/supabase/server/prisma/schema.prisma):

- **`User`**: Account identity, credentials, global role (`Admin`, `Member`, `Tester`, `Viewer`).
- **`Team`**: Tenant entity with unique slug, theme color, and membership records.
- **`TeamMember`**: Join table enforcing user-team membership relations.
- **`Project`**: Team-scoped container for tasks with key prefixes (`ENG`, `DS`, `DB`, `QA`).
- **`Task`**: Task lifecycle with status (`PENDING`, `IN_PROGRESS`, `TESTING`, `COMPLETED`, `FAILED`), priority, tags, order, and tester notes.
- **`Subtask`**: Checkable subtasks linked to parent tasks.
- **`Comment`**: Discussion thread entries with user attribution.
- **`Activity`**: Audit trail recording every status change with timestamps.
- **`WorkflowRule`**: Configurable state transition rules enforced across the organization.
- **`Notification`**: Activity alerts targeted to team members.

### Database Commands:
```bash
# Push schema to live PostgreSQL database
npx prisma db push

# Seed initial teams, projects, tasks, and users
npm run prisma:seed

# Launch visual database browser
npx prisma studio
```

---

## 🌐 100% Free Live Deployment

Deploy the entire stack for **$0** with free subdomains and SSL certificates:

| Tier | Provider | Free Subdomain / URL | Config File |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Netlify](https://www.netlify.com/) | `https://your-app.netlify.app` | `netlify.toml` |
| **Backend API** | [Render](https://render.com/) | `https://your-api.onrender.com` | `render.yaml` |
| **Database** | [Supabase](https://supabase.com/) | Free Cloud PostgreSQL Database | `schema.prisma` |

👉 Follow the complete step-by-step guide in [DEPLOYMENT_GUIDE.md](file:///d:/learning%20(next%20,%20microservices,%20postgresql)%20project/supabase/DEPLOYMENT_GUIDE.md).

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to use, modify, and distribute for personal or commercial projects.
