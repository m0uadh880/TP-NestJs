import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { UuidService } from 'src/uuid/uuid.service';

@Module({
  providers: [TestService,UuidService],
  controllers: [TestController]
})
export class TestModule {}
