import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginCredsDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }


  async register(userData: CreateUserDto): Promise<Partial<User>> {
    const { username, password, email } = userData;
    const user = this.userRepository.create({
      ...userData,
    });
     
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException('username already exists');
    }
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async login(creditentials: LoginCredsDto) {
    const { username, password } = creditentials;
    const name = username;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :name', { name })
      .getOne();

    if (!user) {
      throw new NotFoundException('username not found!');
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    };

    const testPassword = await bcrypt.compare(password, user.password);
    
    if (testPassword) {
      const jwt = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });

      return {
        access_token: jwt,
      };
    } else {
      throw new NotFoundException('Password INCORRECT');
    }
  }

  
  async buildSearchQuery(query: any, search?: string) {
    if (search) {
        query.andWhere('user.name LIKE :search', { search: `%${search}%` });
    }
  
  }

  async applyPagination(query: any, page: number, limit: number) {
    query.skip((page - 1) * limit).take(limit);
  }

  async getAllUsers(search?:string, status?:string, page: number = 1, limit: number = 10) {
    const query = this.userRepository.createQueryBuilder('user');
    
    await this.buildSearchQuery(query, search);
    
    await this.applyPagination(query, page, limit);
    
    const [users, total] = await query.getManyAndCount();

    return {
        users,
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
  }

}