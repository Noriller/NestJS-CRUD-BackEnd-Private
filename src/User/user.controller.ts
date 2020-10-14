import { Body, Controller, Delete, Get, Inject, Injectable, Param, Post, Put } from '@nestjs/common';
import { User } from './entities/User.schema';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { IUserRepository } from './repositories/IUserRepository';

@Controller('user')
@Injectable()
export class UserController {

  constructor(
    @Inject(MongoUserRepository)
    private readonly usersRepository: IUserRepository
  ) { }

  @Get()
  async getAllUsers(@Param() params: string[]): Promise<User[]> {
    console.log(params);
    return this.usersRepository.findAllUsers();
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    console.log(email);
    return this.usersRepository.findUserByEmail(email);
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    console.log(id);
    return this.usersRepository.findUserById(id);
  }

  @Post()
  async saveUser(@Body() user: User): Promise<User> {
    return this.usersRepository.saveUser(user);
  }

  @Put()
  async updateUser(@Body() user: User): Promise<User> {
    return this.usersRepository.updateUser(user);
  }

  @Delete()
  async deleteUser(@Body('id') id: string): Promise<void> {
    return this.usersRepository.deleteUser(id);
  }

}
