import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './models/project.model';
import { CreateProjectInput } from './dto/create-project.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { description: 'Get all projects for a team (Strict Isolation Enforced)' })
  async projects(
    @Args('teamId', { type: () => ID }) teamId: string,
    @CurrentUser() user: any,
  ): Promise<Project[]> {
    return this.projectsService.findByTeam(teamId, user.id, user.role);
  }

  @Query(() => Project, { nullable: true, description: 'Get project details by ID' })
  async project(@Args('id', { type: () => ID }) id: string): Promise<Project | null> {
    return this.projectsService.findById(id);
  }

  @Mutation(() => Project, { description: 'Create a new project within a team' })
  async createProject(
    @Args('input') input: CreateProjectInput,
    @CurrentUser() user: any,
  ): Promise<Project> {
    return this.projectsService.createProject(input, user.id, user.role);
  }
}
