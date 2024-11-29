import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { StatusEnum } from '../../enums/status.enum';
import { TodoValidationMessages } from '../../validation/todo.validation';

export class CreateTodoDto {
  @IsString()
  @MinLength(3, { message: TodoValidationMessages.name.minLength })
  @MaxLength(10, { message: TodoValidationMessages.name.maxLength })
  name: string;
  
  @IsString()
  @IsNotEmpty({ message: TodoValidationMessages.description.isNotEmpty })
  @MinLength(10, { message: TodoValidationMessages.description.minLength })
  description: string;

  @IsNotEmpty({ message: TodoValidationMessages.status.isEnum })
  status: StatusEnum; 
}