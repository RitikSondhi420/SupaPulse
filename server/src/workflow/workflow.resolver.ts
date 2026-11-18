import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WorkflowService } from './workflow.service';
import { WorkflowRule } from './models/workflow-rule.model';
import { UpdateWorkflowRuleInput } from './dto/update-workflow-rule.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';

@Resolver(() => WorkflowRule)
@UseGuards(GqlAuthGuard, RolesGuard)
export class WorkflowResolver {
  constructor(private readonly workflowService: WorkflowService) {}

  @Query(() => [WorkflowRule], { description: 'Get allowed state transition workflow rules' })
  async workflowRules(
    @Args('teamId', { type: () => ID, nullable: true }) teamId?: string,
  ): Promise<WorkflowRule[]> {
    return this.workflowService.getRules(teamId);
  }

  @Mutation(() => WorkflowRule, { description: 'Configure state transition rules (Admin Only)' })
  @Roles(Role.Admin)
  async updateWorkflowRule(
    @Args('input') input: UpdateWorkflowRuleInput,
  ): Promise<WorkflowRule> {
    return this.workflowService.updateRule(input);
  }
}
