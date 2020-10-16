import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../User/entities/User';
import { IUserServiceImplementation } from '../UserInterfaces';

export class MongoUserRepository implements IUserServiceImplementation {

  constructor(
    @InjectModel('User')
    private readonly service: typeof Model
  ) { }

  async saveUser(user: User): Promise<User> {
    const mongoUser = this.getMongoUser(user);
    const savedMongoUser = await new this.service(mongoUser).save();
    return this.toUserFormat(savedMongoUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    const mongoUser = await this.service.findOne({ email: email }).exec();
    return this.toUserFormat(mongoUser);
  }

  async findUserById(id: string): Promise<User> {
    const mongoUser = await this.service.findById(id).exec();
    return this.toUserFormat(mongoUser);
  }

  async findAllUsers(): Promise<User[]> {
    const mongoArray = await this.service.find().exec();
    const userArray = [];
    mongoArray.forEach(
      mongoUser =>
        userArray.push(
          this.toUserFormat(mongoUser)
        )
    );

    return userArray;
  }

  async updateUserById(user: User): Promise<User> {
    const mongoUser = this.getMongoUser(user);
    const updatedUser = await this.service.findOneAndUpdate({ '_id': user.id }, mongoUser, { new: true }).exec();
    return this.toUserFormat(updatedUser);
  }

  async deleteUserById(id: string): Promise<User> {
    const deletedUser = await this.service.findOneAndDelete({ '_id': id }).exec();
    return this.toUserFormat(deletedUser);
  }

  private getMongoUser(user: User) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

  private toUserFormat(mongoUser: MongoUser) {
    if (!mongoUser)
      return null;

    const formattedUser = {
      id: mongoUser._id,
      name: mongoUser.name,
      email: mongoUser.email,
      password: mongoUser.password,
    };
    return new User(formattedUser);
  }

}
interface MongoUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}