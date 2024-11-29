import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from 'src/entity/cv.entity';
import { Skill } from 'src/entity/skill.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, Skill, User])
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}