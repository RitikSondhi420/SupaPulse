import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowRule } from './models/workflow-rule.model';
import { UpdateWorkflowRuleInput } from './dto/update-workflow-rule.input';
import { TaskStatus, Role } from '../common/enums';

export const DEFAULT_RULES_DATA: WorkflowRule[] = [
  // From Pending
  { id: 'r_1', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.IN_PROGRESS, allowed: true, description: 'Developer starts working on the task' },
  { id: 'r_2', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.TESTING, allowed: false, description: 'Cannot skip straight to testing without active implementation' },
  { id: 'r_3', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.COMPLETED, allowed: false, description: 'Tasks cannot jump from backlog directly to production' },
  { id: 'r_4', fromStatus: TaskStatus.PENDING, toStatus: TaskStatus.FAILED, allowed: true, description: 'Reject invalid backlog tickets directly' },

  // From In Progress
  { id: 'r_5', fromStatus: TaskStatus.IN_PROGRESS, toStatus: TaskStatus.TESTING, allowed: true, description: 'Hand over code to QA testers or code review' },
  { id: 'r_6', fromStatus: TaskStatus.IN_PROGRESS, toStatus: TaskStatus.PENDING, allowed: true, description: 'Pause work or reprioritize back to backlog' },
  { id: 'r_7', fromStatus: TaskStatus.IN_PROGRESS, toStatus: TaskStatus.COMPLETED, allowed: true, requiredRoles: [Role.Admin, Role.Tester], description: 'Direct pass (allowed for Admins or minor docs)' },
  { id: 'r_8', fromStatus: TaskStatus.IN_PROGRESS, toStatus: TaskStatus.FAILED, allowed: true, description: 'Mark as blocked due to external breaking dependency' },

  // From Testing
  { id: 'r_9', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.COMPLETED, allowed: true, requiredRoles: [Role.Admin, Role.Tester], description: 'QA Tester or Admin confirms test pass' },
  { id: 'r_10', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.FAILED, allowed: true, requiredRoles: [Role.Admin, Role.Tester], description: 'QA Tester rejects task due to defects or test failures' },
  { id: 'r_11', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.IN_PROGRESS, allowed: true, description: 'Send back to developer for adjustments' },
  { id: 'r_12', fromStatus: TaskStatus.TESTING, toStatus: TaskStatus.PENDING, allowed: false, description: 'Must reject or return to in-progress, not drop to backlog' },

  // From Completed
  { id: 'r_13', fromStatus: TaskStatus.COMPLETED, toStatus: TaskStatus.PENDING, allowed: false, description: 'Completed tasks are locked; use Re-open to In Progress instead' },
  { id: 'r_14', fromStatus: TaskStatus.COMPLETED, toStatus: TaskStatus.IN_PROGRESS, allowed: true, requiredRoles: [Role.Admin], description: 'Admin re-opens completed task if bug reported later' },
  { id: 'r_15', fromStatus: TaskStatus.COMPLETED, toStatus: TaskStatus.TESTING, allowed: false, description: 'Cannot transition directly without active rework' },
  { id: 'r_16', fromStatus: TaskStatus.COMPLETED, toStatus: TaskStatus.FAILED, allowed: false, description: 'Cannot fail an already accepted production deployment' },

  // From Failed
  { id: 'r_17', fromStatus: TaskStatus.FAILED, toStatus: TaskStatus.IN_PROGRESS, allowed: true, description: 'Developer addresses tester comments and bug reports' },
  { id: 'r_18', fromStatus: TaskStatus.FAILED, toStatus: TaskStatus.PENDING, allowed: true, description: 'Move back to backlog for re-triage' },
  { id: 'r_19', fromStatus: TaskStatus.FAILED, toStatus: TaskStatus.TESTING, allowed: true, description: 'Re-submit for verification once hotfix ready' },
  { id: 'r_20', fromStatus: TaskStatus.FAILED, toStatus: TaskStatus.COMPLETED, allowed: false, description: 'Failed tasks must pass testing before being marked complete' },
];

@Injectable()
export class WorkflowService {
  private inMemoryRules: WorkflowRule[] = [...DEFAULT_RULES_DATA];

  constructor(private readonly prisma: PrismaService) {}

  async getRules(teamId?: string): Promise<WorkflowRule[]> {
    if (this.prisma.isConnected) {
      const rules = await this.prisma.workflowRule.findMany({
        where: teamId ? { teamId } : {},
      });
      if (rules.length > 0) {
        return rules.map((r) => ({
          id: r.id,
          teamId: r.teamId,
          fromStatus: r.fromStatus as any,
          toStatus: r.toStatus as any,
          allowed: r.allowed,
          requiredRoles: r.requiredRole ? [r.requiredRole as any] : undefined,
          description: r.description,
        }));
      }
    }
    return this.inMemoryRules;
  }

  async validateTransition(
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
    userRole: string,
    teamId?: string,
  ): Promise<boolean> {
    if (fromStatus === toStatus) return true;

    const rules = await this.getRules(teamId);
    const rule = rules.find((r) => r.fromStatus === fromStatus && r.toStatus === toStatus);

    if (rule && !rule.allowed) {
      throw new BadRequestException(
        `Transition Blocked: Moving from '${fromStatus}' to '${toStatus}' is forbidden by team workflow policy: ${rule.description || 'Not allowed'}`
      );
    }

    if (rule?.requiredRoles && rule.requiredRoles.length > 0) {
      const allowedRoles = [...rule.requiredRoles, Role.Admin];
      if (!allowedRoles.includes(userRole as any)) {
        throw new BadRequestException(
          `Permission Denied: Only users with roles [${rule.requiredRoles.join(', ')}] can move tasks to '${toStatus}'. Current role: ${userRole}`
        );
      }
    }

    return true;
  }

  async updateRule(input: UpdateWorkflowRuleInput): Promise<WorkflowRule> {
    if (this.prisma.isConnected) {
      const updated = await this.prisma.workflowRule.upsert({
        where: {
          teamId_fromStatus_toStatus: {
            teamId: input.teamId || '',
            fromStatus: input.fromStatus,
            toStatus: input.toStatus,
          },
        },
        create: {
          teamId: input.teamId,
          fromStatus: input.fromStatus,
          toStatus: input.toStatus,
          allowed: input.allowed,
          description: input.description,
          requiredRole: input.requiredRoles?.[0],
        },
        update: {
          allowed: input.allowed,
          description: input.description,
          requiredRole: input.requiredRoles?.[0],
        },
      });

      return {
        id: updated.id,
        teamId: updated.teamId,
        fromStatus: updated.fromStatus as any,
        toStatus: updated.toStatus as any,
        allowed: updated.allowed,
        requiredRoles: updated.requiredRole ? [updated.requiredRole as any] : undefined,
        description: updated.description,
      };
    }

    const index = this.inMemoryRules.findIndex(
      (r) => r.fromStatus === input.fromStatus && r.toStatus === input.toStatus,
    );

    if (index !== -1) {
      this.inMemoryRules[index] = {
        ...this.inMemoryRules[index],
        allowed: input.allowed,
        description: input.description || this.inMemoryRules[index].description,
        requiredRoles: input.requiredRoles || this.inMemoryRules[index].requiredRoles,
      };
      return this.inMemoryRules[index];
    }

    const newRule: WorkflowRule = {
      id: 'rule_' + Date.now(),
      teamId: input.teamId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      allowed: input.allowed,
      requiredRoles: input.requiredRoles,
      description: input.description,
    };
    this.inMemoryRules.push(newRule);
    return newRule;
  }
}
