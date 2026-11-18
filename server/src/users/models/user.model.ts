import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../common/enums';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => [String])
  teamIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
