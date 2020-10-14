import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/User/entities/User.schema';
import { IUserRepository } from '../IUserRepository';

@Injectable()
export class MongoUserRepository implements IUserRepository {

  constructor(
    @InjectModel('User')
    private readonly usersRepository: Model<User>
  ) { }

  async saveUser(user: User): Promise<User> {
    return await new this.usersRepository(user).save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email: email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    return this.usersRepository.findById(id).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find().exec();
  }

  async updateUser(user: User): Promise<User> {
    return await this.usersRepository.findOneAndUpdate({ '_id': user.id }, user, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersRepository.findOneAndDelete({ '_id': id }).exec();
  }

}