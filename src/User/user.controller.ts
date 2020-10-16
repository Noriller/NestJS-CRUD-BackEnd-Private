import { Body, Controller, Delete, Get, Injectable, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User';

@Controller('user')
@Injectable()
export class UserController {

  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @Post()
  async saveUser(@Body() user: User): Promise<User> {
    return this.userService.saveUser(user);
  }

  @Put()
  async updateUser(@Body('originalEmail') originalEmail: string, @Body('user') newUserInfo: User): Promise<User> {
    return this.userService.updateUser(originalEmail, newUserInfo);
  }

  @Delete()
  async deleteUser(@Body('email') email: string): Promise<void> {
    return this.userService.deleteUser(email);
  }

}
