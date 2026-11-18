import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.type';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { User } from '../users/models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, { description: 'Authenticate existing user with email and password' })
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthPayload, { description: 'Register a new user account with role and default team access' })
  async signup(@Args('input') input: SignupInput): Promise<AuthPayload> {
    return this.authService.signup(input);
  }

  @Query(() => User, { description: 'Get profile of currently authenticated user' })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() currentUser: any): Promise<User> {
    return this.authService.findById(currentUser?.id || 'usr_admin');
  }
}
