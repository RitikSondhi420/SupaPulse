import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { TaskStatus, Priority } from '../../common/enums';

@ObjectType()
export class Subtask {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  completed: boolean;
}

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  userName: string;

  @Field({ nullable: true })
  userAvatar?: string;

  @Field()
  userRole: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class Activity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  userName: string;

  @Field()
  action: string;

  @Field(() => TaskStatus, { nullable: true })
  fromStatus?: TaskStatus;

  @Field(() => TaskStatus, { nullable: true })
  toStatus?: TaskStatus;

  @Field()
  timestamp: Date;
}

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => ID)
  teamId: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => ID, { nullable: true })
  assigneeId?: string;

  @Field(() => ID)
  reporterId: string;

  @Field(() => ID, { nullable: true })
  testerId?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => [String])
  tags: string[];

  @Field(() => [Subtask])
  subtasks: Subtask[];

  @Field(() => [Comment])
  comments: Comment[];

  @Field(() => [Activity])
  activity: Activity[];

  @Field({ nullable: true })
  testerNotes?: string;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
