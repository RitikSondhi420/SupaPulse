import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { TaskStatus, Priority } from '../../common/enums';

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => ID, { nullable: true })
  assigneeId?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  testerNotes?: string;
}

@InputType()
export class MoveTaskInput {
  @Field(() => ID)
  taskId: string;

  @Field(() => TaskStatus)
  targetStatus: TaskStatus;

  @Field(() => Int, { nullable: true })
  targetIndex?: number;
}

@InputType()
export class TesterVerdictInput {
  @Field(() => ID)
  taskId: string;

  @Field()
  passed: boolean;

  @Field()
  notes: string;
}

@InputType()
export class AddCommentInput {
  @Field(() => ID)
  taskId: string;

  @Field()
  text: string;
}
