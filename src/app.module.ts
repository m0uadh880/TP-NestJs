import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { TodoModule } from './todo/todo.module';
import { UuidService } from './uuid/uuid.service';


@Module({
  imports: [
    CommonModule,
    TestModule,
    TodoModule,
    TypeOrmModule.forRoot(
      {
        type:'mysql',
        host: 'localhost',
        port: 3306, 
        username: 'root', 
        password: 'password', 
        database: 'tododb', 
        entities: [
          TodoEntity
        ],
      synchronize: true, 
    })
  ],
  controllers: [AppController],
  providers: [AppService, UuidService],
  
})
export class AppModule {}
