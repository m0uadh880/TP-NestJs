import { Controller, Get, Inject } from '@nestjs/common';
import { UuidService } from 'src/uuid/uuid.service';

@Controller('test')


export class TestController {

  constructor(
    @Inject(UuidService) private readonly uuid: () => string
  ){

  }
  @Get('/uuid')
  getUUID(): string{
    return this.uuid();
  }
}
