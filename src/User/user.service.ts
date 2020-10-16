import { Injectable } from '@nestjs/common';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { IUserServiceAbstraction } from './repositories/UserInterfaces';
import { generateHashPassword } from './utils/utils';


@Injectable()
export class UserService implements IUserServiceAbstraction {

  constructor(
    private readonly repository: MongoUserRepository
  ) { }

  async saveUser(user: UserDTO): Promise<User> {
    if (user.id || (user.email && this.findUserByEmail(user.email)))
      throw new Error(`User already exists.`);

    user.password = await generateHashPassword(user.password);

    const userToSave = new User(user);

    return await this.repository.saveUser(userToSave);
  }

  async findUserByEmail(email: string): Promise<User> {
    if (!email)
      throw new Error("Email cannot be empty.");

    return await this.repository.findUserByEmail(email);
  }

  async findUserById(id: string): Promise<User> {
    if (!id)
      throw new Error("ID cannot be empty.");

    return await this.repository.findUserById(id);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.repository.findAllUsers();
  }

  async updateUser(user: UserDTO): Promise<User> {
    if (!user.email)
      throw new Error("Email cannot be empty.");
    if (!user.id) {
      const userFoundById = await this.findUserByEmail(user.email);
      if (!userFoundById.id)
        throw new Error(`User couldn't be found.`);
      user.id = userFoundById.id;
    }

    const userToUpdate = new User(user);

    return await this.repository.updateUserById(userToUpdate);
  }

  async deleteUser(id: string): Promise<void> {
    if (!id)
      throw new Error("ID cannot be empty.");
    if (!this.findUserById(id))
      throw new Error(`User couldn't be found.`);

    return await this.repository.deleteUser(id);
  }

}