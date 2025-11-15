import { IsNumber, IsPositive, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({
    description: 'Monto a aplicar al balance',
    example: 50.00,
    minimum: 0.01
  })
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({
    description: 'Tipo de operación a realizar',
    enum: ['add', 'subtract', 'set'],
    example: 'add'
  })
  @IsIn(['add', 'subtract', 'set'], { 
    message: 'La operación debe ser add, subtract o set' 
  })
  operation: 'add' | 'subtract' | 'set';

  @ApiProperty({
    description: 'Descripción opcional de la transacción',
    example: 'Recarga de saldo',
    required: false
  })
  @IsOptional()
  description?: string;
}
