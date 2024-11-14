import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from 'src/entity/todo.entity';
import { TodoController } from './todo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity])
  ],
  providers: [TodoService], 
  controllers: [TodoController]
})
export class TodoModule {}