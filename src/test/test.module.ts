import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TestService],
  controllers: [TestController]
})
export class TestModule {}
