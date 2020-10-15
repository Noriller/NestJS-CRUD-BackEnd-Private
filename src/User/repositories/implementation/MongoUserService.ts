import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/User/entities/User.schema';
import { IUserService } from '../IUserService';

@Injectable()
export class MongoUserService implements IUserService {

  constructor(
    @InjectModel('User')
    private readonly userService: Model<User>
  ) { }

  async saveUser(user: User): Promise<User> {
    return await new this.userService(user).save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userService.findOne({ email: email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    return this.userService.findById(id).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userService.find().exec();
  }

  async updateUser(user: User): Promise<User> {
    return await this.userService.findOneAndUpdate({ '_id': user.id }, user, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userService.findOneAndDelete({ '_id': id }).exec();
  }

}