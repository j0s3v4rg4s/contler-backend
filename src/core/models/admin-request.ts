import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  hotelName!: string;

  @IsNotEmpty()
  hotelLogo!: string;

  @IsNotEmpty()
  name!: string;

}
