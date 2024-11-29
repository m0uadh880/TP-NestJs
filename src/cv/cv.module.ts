import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from '../entity/cv.entity';
import { Skill } from '../entity/skill.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, Skill, User])
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}