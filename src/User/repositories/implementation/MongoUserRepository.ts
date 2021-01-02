import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../User/entities/User';
import { IUserServiceImplementation } from '../UserInterfaces';

export class MongoUserRepository implements IUserServiceImplementation {

  constructor (
    @InjectModel( 'User' )
    private readonly service: typeof Model
  ) { }

  async saveUser ( user: User ): Promise<User> {
    return await this.service.create( user );
  }

  async findUserByEmail ( email: string ): Promise<User> {
    return await this.service.findOne( { email: email } ).exec();
  }

  async findUserById ( _id: string ): Promise<User> {
    return await this.service.findById( _id ).exec();
  }

  async findAllUsers (): Promise<User[]> {
    const mongoArray = await this.service.find().exec();
    const userArray = [];
    mongoArray.forEach(
      user => userArray.push( user )
    );

    return userArray;
  }

  async updateUserById ( user: User ): Promise<User> {
    return await this.service.findOneAndUpdate( { '_id': user.id() }, user, { new: true } ).exec();
  }

  async deleteUserById ( _id: string ): Promise<User> {
    return await this.service.findOneAndDelete( { '_id': _id } ).exec();
  }
}