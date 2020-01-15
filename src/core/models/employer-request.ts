import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { CHIEF, EMPLOYER } from '../const/roles';

export class EmployerRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  idHotel!: string;

  @IsNotEmpty()
  @IsIn([EMPLOYER, CHIEF])
  rol!: typeof EMPLOYER | typeof CHIEF;

  @IsNotEmpty()
  leaderZone!: { [key: string]: boolean };
}
