import { IsEmail, IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class FacebookAuthDto {
  @IsString()
  @IsNotEmpty()
  facebookId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  picture?: string;
}

export class MobileFacebookAuthDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class FacebookAuthResponseDto {
  success: boolean;
  data: {
    id: string;
    email: string;
    roles: string;
    isNewUser: boolean;
    name: string;
  };
  message: string;
}


