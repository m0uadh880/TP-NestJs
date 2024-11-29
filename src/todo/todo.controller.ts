import { Controller, Post, Body, Patch, Param, Delete, Get, ParseIntPipe, Query, Version, Put, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { StatusEnum } from '../enums/status.enum';
import { CreateTodoDto } from '../todo/dto/create.dto';
import { UpdateTodoDto } from '../todo/dto/update.dto';
import { TodoEntity } from '../entity/todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Version('1')
  async addTodo1(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('status') status: StatusEnum,
  ) {
    return this.todoService.addTodo1(name, description, status);
  }

  @Post()
  @Version('2')
  async addTodo2(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const userId = req['userId'];
    return this.todoService.addTodo2(createTodoDto,userId);
  }

  
  @Get(':id')
  async getTodoById(@Param('id') id: number): Promise<TodoEntity> {
    return this.todoService.getTodoById(id);
  }
  
  @Get()
  async getAllTodos(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ todos: TodoEntity[]; total: number; page: number; lastPage: number }> {
    return this.todoService.getAllTodos(search, status, page, limit);
  }


  @Put(':id')
  async updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request
  ) {
    const userId = req['user'].userId;
    return this.todoService.updateTodo(id, updateTodoDto, userId);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number, @Req() req: Request) {
    const userId = req['user'].userId;
    await this.todoService.deleteTodo(id, userId);
    return { message: `Todo with id ${id} deleted successfully` };
  }

  @Get(':id/restore')
  async restoreTodo(
    @Param('id') id: number,
  ): Promise<TodoEntity> {
    return this.todoService.restoreTodo(id);
  }

  @Get('count/status')
  async countTodosByStatus() {
    return this.todoService.countTodosByStatus();
  }
}