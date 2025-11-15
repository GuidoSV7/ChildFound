import { IsEmail, IsString, MaxLength, MinLength, IsOptional, IsNumber, Min, Max, IsUUID, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(120)
    age?: number;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    rubro?: string;

    @IsString()
    @IsOptional()
    googleId?: string;

    @IsUUID()
    @IsOptional()
    moduleId?: string;

    @IsEnum(Role)
    @IsOptional()
    roles?: Role;
}