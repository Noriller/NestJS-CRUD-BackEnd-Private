import { Body, Controller, Delete, Get, Inject, Injectable, Param, Post, Put } from '@nestjs/common';
import { User } from './entities/User.schema';
import { MongoUserService } from './repositories/implementation/MongoUserService';
import { IUserService } from './repositories/IUserService';

@Controller('user')
@Injectable()
export class UserController {

  constructor(
    @Inject(MongoUserService)
    private readonly userService: IUserService
  ) { }

  @Get()
  async getAllUsers(@Param() params: string[]): Promise<User[]> {
    console.log(params);
    return this.userService.findAllUsers();
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    console.log(email);
    return this.userService.findUserByEmail(email);
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    console.log(id);
    return this.userService.findUserById(id);
  }

  @Post()
  async saveUser(@Body() user: User): Promise<User> {
    return this.userService.saveUser(user);
  }

  @Put()
  async updateUser(@Body() user: User): Promise<User> {
    return this.userService.updateUser(user);
  }

  @Delete()
  async deleteUser(@Body('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

}
