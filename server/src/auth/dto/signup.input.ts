import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enums';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field(() => Role, { nullable: true, defaultValue: Role.Member })
  @IsOptional()
  role?: Role;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;
}
