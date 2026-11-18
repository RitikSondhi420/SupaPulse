import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskStatus, Role } from '../../common/enums';

@InputType()
export class UpdateWorkflowRuleInput {
  @Field(() => ID, { nullable: true })
  teamId?: string;

  @Field(() => TaskStatus)
  fromStatus: TaskStatus;

  @Field(() => TaskStatus)
  toStatus: TaskStatus;

  @Field()
  allowed: boolean;

  @Field(() => [Role], { nullable: true })
  requiredRoles?: Role[];

  @Field({ nullable: true })
  description?: string;
}
