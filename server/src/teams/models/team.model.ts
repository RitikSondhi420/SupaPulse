import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Team {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  color: string;

  @Field()
  icon: string;

  @Field(() => [String])
  memberIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
