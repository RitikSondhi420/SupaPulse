import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  teamId: string;

  @Field()
  senderName: string;

  @Field({ nullable: true })
  senderAvatar?: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => ID, { nullable: true })
  taskId?: string;

  @Field()
  type: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;
}
