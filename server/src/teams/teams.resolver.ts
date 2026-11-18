import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { Team } from './models/team.model';
import { CreateTeamInput, TeamMemberInput } from './dto/create-team.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Team)
@UseGuards(GqlAuthGuard)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => [Team], { description: 'Get all teams accessible to the current user (Strict Team Isolation)' })
  async myTeams(@CurrentUser() user: any): Promise<Team[]> {
    return this.teamsService.getUserTeams(user.id, user.role);
  }

  @Query(() => Team, { description: 'Get a specific team by ID (enforcing membership boundary)' })
  async team(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ): Promise<Team> {
    return this.teamsService.findById(id, user.id, user.role);
  }

  @Mutation(() => Team, { description: 'Create a new team workspace' })
  async createTeam(
    @Args('input') input: CreateTeamInput,
    @CurrentUser() user: any,
  ): Promise<Team> {
    return this.teamsService.createTeam(input, user.id);
  }

  @Mutation(() => Team, { description: 'Add a user to a team' })
  async addTeamMember(@Args('input') input: TeamMemberInput): Promise<Team> {
    return this.teamsService.addMember(input);
  }

  @Mutation(() => Team, { description: 'Remove a user from a team' })
  async removeTeamMember(@Args('input') input: TeamMemberInput): Promise<Team> {
    return this.teamsService.removeMember(input);
  }
}
