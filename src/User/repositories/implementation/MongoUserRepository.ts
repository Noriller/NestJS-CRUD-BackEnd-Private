import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/User/entities/User';
import { IUserServiceImplementation } from '../UserInterfaces';

@Injectable()
export class MongoUserRepository implements IUserServiceImplementation {

  constructor(
    @InjectModel('User')
    private readonly service: typeof Model
  ) { }

  async saveUser(user: User): Promise<User> {
    const mongoUser = this.getMongoUser(user);
    return await new this.service(mongoUser).save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.service.findOne({ email: email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    return this.service.findById(id).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.service.find().exec();
  }

  async updateUserById(user: User): Promise<User> {
    const mongoUser = this.getMongoUser(user);
    return await this.service.findOneAndUpdate({ '_id': user.id }, mongoUser, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.service.findOneAndDelete({ '_id': id }).exec();
  }

  private getMongoUser(user: User) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

}