import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { TaskStatus, Priority } from '../../common/enums';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  testerNotes?: string;
}

@InputType()
export class MoveTaskInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @Field(() => TaskStatus)
  @IsEnum(TaskStatus)
  targetStatus: TaskStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  targetIndex?: number;
}

@InputType()
export class TesterVerdictInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @Field()
  @IsBoolean()
  passed: boolean;

  @Field()
  @IsString()
  notes: string;
}

@InputType()
export class AddCommentInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;
}
