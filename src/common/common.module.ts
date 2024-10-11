import { Global, Module } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Global()
@Module({
  exports: ['UUID'],
  providers: [{
   provide: 'UUID', 
   useValue: uuid, 
  }]
})
export class CommonModule {}
