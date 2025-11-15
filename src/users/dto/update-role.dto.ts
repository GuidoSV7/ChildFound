import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: Role,
    example: Role.USER
  })
  @IsEnum(Role, {
    message: 'El rol debe ser: admin o user'
  })
  @IsNotEmpty({ message: 'El rol es requerido' })
  role: Role;
}
