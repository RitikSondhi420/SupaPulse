import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  teamId: string;

  @Field()
  name: string;

  @Field()
  key: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  color: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
