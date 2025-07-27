import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';
import { Match } from '../match.decorator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @MaxLength(100)
  @IsNotEmpty()
  username: string;
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
  @IsNotEmpty()
  password: string;
  @Match('password')
  @IsNotEmpty()
  passwordConfirm: string;
}
