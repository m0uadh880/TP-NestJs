import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginCredsDto } from './dto/login.dto';
import { User } from '../entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  register(@Body() userData: CreateUserDto) {
    return this.userService.register(userData);
  }
  @Post('login')
  login(@Body() creditentials: LoginCredsDto) {
    return this.userService.login(creditentials);
  }

  @Get()
  async getAllUsers(
  ){
    return this.userService.getAllUsers();
  }

}