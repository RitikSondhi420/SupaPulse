import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TaskStatus, Role } from '../../common/enums';

@ObjectType()
export class WorkflowRule {
  @Field(() => ID)
  id: string;

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
