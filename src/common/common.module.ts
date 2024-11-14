import { Global, Module } from '@nestjs/common';
import { UuidService } from 'src/uuid/uuid.service';

@Global()
@Module({
  exports: ['UUID'],
  providers: [UuidService]
})
export class CommonModule {}
