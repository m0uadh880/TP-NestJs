import { Controller, Get, Inject } from '@nestjs/common';

@Controller('test')


export class TestController {

  constructor(
    @Inject('UUID') private readonly uuid: () => string
  ){

  }
  @Get('/uuid')
  getUUID(): string{
    return this.uuid();
  }
}
