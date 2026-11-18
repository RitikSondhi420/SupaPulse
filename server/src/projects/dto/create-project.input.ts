import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  @IsNotEmpty()
  teamId: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  key: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: '#3ecf8e' })
  color: string;
}
