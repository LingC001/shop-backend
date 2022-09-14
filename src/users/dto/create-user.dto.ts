import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly account: string;

  @IsNotEmpty()
  readonly password: string;
}
