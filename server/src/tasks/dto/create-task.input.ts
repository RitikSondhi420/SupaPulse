import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TaskStatus, Priority } from '../../common/enums';

@InputType()
export class CreateSubtaskInput {
  @Field()
  title: string;

  @Field({ defaultValue: false })
  completed: boolean;
}

@InputType()
export class CreateTaskInput {
  @Field(() => ID)
  @IsNotEmpty()
  teamId: string;

  @Field(() => ID)
  @IsNotEmpty()
  projectId: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus, { defaultValue: TaskStatus.PENDING })
  status: TaskStatus;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @Field(() => ID, { nullable: true })
  assigneeId?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field(() => [CreateSubtaskInput], { nullable: true })
  subtasks?: CreateSubtaskInput[];
}
