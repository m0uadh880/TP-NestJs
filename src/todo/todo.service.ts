import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { CreateTodoDto } from '../todo/dto/create.dto';
import { UpdateTodoDto } from '../todo/dto/update.dto';
import { TodoEntity } from '../entity/todo.entity';
import { StatusEnum } from '../enums/status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async addTodo1(name: string, description: string, status: StatusEnum): Promise<TodoEntity> {
    const newTodo = new TodoEntity();
    newTodo.name = name;
    newTodo.description = description;
    newTodo.status = status;

    return await this.todoRepository.save(newTodo);
  }

  async addTodo2(createTodoDto: CreateTodoDto,userId: string): Promise<TodoEntity> {
    const errors = await validate(createTodoDto);
    if (errors.length > 0) {
      throw errors;
    } else {
      const newTodo = this.todoRepository.create(createTodoDto);
      return await this.todoRepository.save({...newTodo, 
        userId: userId});
    }
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto, userId: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    if (todo.userId !== userId) throw new ForbiddenException('Unauthorized to update this todo');


    Object.assign(todo, updateTodoDto);

    return await this.todoRepository.save(todo);
  }

  async deleteTodo(id: number,userId: string) {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (todo.userId !== userId) throw new ForbiddenException('Unauthorized to update this todo');
    await this.todoRepository.softDelete(id);
  }

  async restoreTodo(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id }, withDeleted: true });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (!todo.deletedAt) {
      throw new NotFoundException(`Todo with ID ${id} is not deleted`);
    }

    await this.todoRepository.restore(id);

    return todo;
  }

  async countTodosByStatus(): Promise<Record<StatusEnum, number>> {
    const todos = await this.todoRepository.find();

    const statusCount: Record<StatusEnum, number> = {
      [StatusEnum.PENDING]: 0,
      [StatusEnum.IN_PROGRESS]: 0,
      [StatusEnum.COMPLETED]: 0,
    };

    todos.forEach(todo => {
      statusCount[todo.status]++;
    });

    return statusCount;
  }

  async buildSearchQuery(query: any, search?: string, status?: string) {
    if (search) {
        query.andWhere('todo.name LIKE :search OR todo.description LIKE :search', { search: `%${search}%` });
    }
    if (status) {
        query.andWhere('todo.status = :status', { status });
    }
  }

  async applyPagination(query: any, page: number, limit: number) {
    query.skip((page - 1) * limit).take(limit);
  }

  async getAllTodos(search?:string, status?:string, page: number = 1, limit: number = 10) {
    const query = this.todoRepository.createQueryBuilder('todo');
    
    await this.buildSearchQuery(query, search, status);
    
    await this.applyPagination(query, page, limit);
    
    const [todos, total] = await query.getManyAndCount();

    return {
        todos,
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
  }

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }
}