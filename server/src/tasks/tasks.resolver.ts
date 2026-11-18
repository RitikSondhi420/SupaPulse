import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput, MoveTaskInput, TesterVerdictInput, AddCommentInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Task)
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], { description: 'Get all tasks for a specific team (Strict Tenant Isolation)' })
  async tasks(
    @Args('teamId', { type: () => ID }) teamId: string,
    @Args('projectId', { type: () => ID, nullable: true }) projectId: string | undefined,
    @CurrentUser() user: any,
  ): Promise<Task[]> {
    return this.tasksService.findByTeam(teamId, projectId, user.id, user.role);
  }

  @Query(() => Task, { description: 'Get task details by ID' })
  async task(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.findById(id, user.id, user.role);
  }

  @Mutation(() => Task, { description: 'Create a new task within a team' })
  async createTask(
    @Args('input') input: CreateTaskInput,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.createTask(input, user);
  }

  @Mutation(() => Task, { description: 'Move task across workflow states or reorder (Validates state transition policy)' })
  async moveTask(
    @Args('input') input: MoveTaskInput,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.moveTask(input, user);
  }

  @Mutation(() => Task, { description: 'Submit QA Tester Verdict (Pass -> Completed, Fail -> Failed with notes)' })
  async submitTesterVerdict(
    @Args('input') input: TesterVerdictInput,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.submitTesterVerdict(input, user);
  }

  @Mutation(() => Task, { description: 'Update task properties' })
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.updateTask(input, user);
  }

  @Mutation(() => Task, { description: 'Toggle subtask completion state' })
  async toggleSubtask(
    @Args('taskId', { type: () => ID }) taskId: string,
    @Args('subtaskId', { type: () => ID }) subtaskId: string,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.toggleSubtask(taskId, subtaskId, user);
  }

  @Mutation(() => Task, { description: 'Add comment to task discussion thread' })
  async addComment(
    @Args('input') input: AddCommentInput,
    @CurrentUser() user: any,
  ): Promise<Task> {
    return this.tasksService.addComment(input, user);
  }

  @Mutation(() => Boolean, { description: 'Delete a task' })
  async deleteTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.tasksService.deleteTask(id, user);
  }
}
