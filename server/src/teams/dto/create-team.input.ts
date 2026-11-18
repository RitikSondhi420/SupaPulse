import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTeamInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: '#3ecf8e' })
  color: string;

  @Field({ defaultValue: 'Layers' })
  icon: string;
}

@InputType()
export class TeamMemberInput {
  @Field()
  teamId: string;

  @Field()
  userId: string;
}
