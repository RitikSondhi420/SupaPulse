import { registerEnumType } from '@nestjs/graphql';
import { Role, TaskStatus, Priority } from '@prisma/client';

export { Role, TaskStatus, Priority };

registerEnumType(Role, {
  name: 'Role',
  description: 'User access role: Admin, Member, Tester, or Viewer',
});

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Task workflow stage: PENDING, IN_PROGRESS, TESTING, COMPLETED, or FAILED',
});

registerEnumType(Priority, {
  name: 'Priority',
  description: 'Task priority level: URGENT, HIGH, MEDIUM, or LOW',
});
