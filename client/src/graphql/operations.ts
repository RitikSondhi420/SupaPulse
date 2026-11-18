export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        name
        avatar
        role
        teamIds
      }
    }
  }
`;

export const SIGNUP_MUTATION = `
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      user {
        id
        email
        name
        avatar
        role
        teamIds
      }
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      avatar
      role
      teamIds
    }
  }
`;

export const USERS_QUERY = `
  query Users {
    users {
      id
      email
      name
      avatar
      role
      teamIds
    }
  }
`;

export const MY_TEAMS_QUERY = `
  query MyTeams {
    myTeams {
      id
      name
      slug
      description
      color
      icon
      memberIds
    }
  }
`;

export const CREATE_TEAM_MUTATION = `
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      slug
      description
      color
      icon
      memberIds
    }
  }
`;

export const PROJECTS_QUERY = `
  query Projects($teamId: ID!) {
    projects(teamId: $teamId) {
      id
      teamId
      name
      key
      description
      color
      createdAt
    }
  }
`;

export const CREATE_PROJECT_MUTATION = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      teamId
      name
      key
      description
      color
      createdAt
    }
  }
`;

export const TASKS_QUERY = `
  query Tasks($teamId: ID!, $projectId: ID) {
    tasks(teamId: $teamId, projectId: $projectId) {
      id
      code
      title
      description
      status
      priority
      teamId
      projectId
      assigneeId
      reporterId
      testerId
      dueDate
      tags
      order
      testerNotes
      subtasks {
        id
        title
        completed
      }
      comments {
        id
        userId
        userName
        userAvatar
        userRole
        text
        createdAt
      }
      activity {
        id
        userId
        userName
        action
        fromStatus
        toStatus
        timestamp
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      code
      title
      description
      status
      priority
      teamId
      projectId
      assigneeId
      reporterId
      testerId
      dueDate
      tags
      subtasks {
        id
        title
        completed
      }
      createdAt
    }
  }
`;

export const MOVE_TASK_MUTATION = `
  mutation MoveTask($input: MoveTaskInput!) {
    moveTask(input: $input) {
      id
      status
      order
      activity {
        id
        userName
        action
        timestamp
      }
    }
  }
`;

export const SUBMIT_TESTER_VERDICT_MUTATION = `
  mutation SubmitTesterVerdict($input: TesterVerdictInput!) {
    submitTesterVerdict(input: $input) {
      id
      status
      testerNotes
      activity {
        id
        userName
        action
        timestamp
      }
    }
  }
`;

export const WORKFLOW_RULES_QUERY = `
  query WorkflowRules($teamId: ID) {
    workflowRules(teamId: $teamId) {
      id
      teamId
      fromStatus
      toStatus
      allowed
      requiredRoles
      description
    }
  }
`;

export const UPDATE_WORKFLOW_RULE_MUTATION = `
  mutation UpdateWorkflowRule($input: UpdateWorkflowRuleInput!) {
    updateWorkflowRule(input: $input) {
      id
      fromStatus
      toStatus
      allowed
      description
    }
  }
`;

export const NOTIFICATIONS_QUERY = `
  query Notifications {
    notifications {
      id
      userId
      teamId
      senderName
      senderAvatar
      title
      message
      taskId
      type
      read
      createdAt
    }
  }
`;
