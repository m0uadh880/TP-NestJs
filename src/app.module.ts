import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { TodoModule } from './todo/todo.module';
import { UuidService } from './uuid/uuid.service';
import * as dotenv from 'dotenv';
import { AuthMiddleware } from './middleware/auth.middleware';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { Skill } from './entity/skill.entity';
import { Cv } from './entity/cv.entity';
import { User } from './entity/user.entity';



dotenv.config();

@Module({
  imports: [
    CommonModule,
    TestModule,
    TodoModule,
    TypeOrmModule.forRoot(
      {
        type:'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT, 
        username: process.env.DB_USERNAME, 
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_NAME, 
        entities: [
          TodoEntity,
          Skill,
          Cv,
          User
        ],
      synchronize: true, 
    }),
    TodoModule,
    CvModule,
    UserModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService, UuidService],
  
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/todo', method: RequestMethod.ALL });
  }
}
