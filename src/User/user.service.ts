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

  async findAllUsers(): Promise<User[]> {
    return await this.repository.findAllUsers();
  }

  async updateUser(originalEmail: string, newUserInfo: UserDTO): Promise<User> {
    if (!originalEmail)
      throw new Error("Must provide original email.");

    if (!newUserInfo.id) {
      const userFound = await this.findUserByEmail(originalEmail);
      if (!userFound.id)
        throw new Error(`User couldn't be found.`);

      newUserInfo.id = userFound.id;
    }

    const userToUpdate = new User(newUserInfo);

    return await this.repository.updateUserById(userToUpdate);
  }

  async deleteUser(email: string): Promise<void> {
    if (!email)
      throw new Error("Email cannot be empty.");

    const userFound = await this.repository.findUserByEmail(email);
    if (!userFound)
      throw new Error(`User couldn't be found.`);

    return await this.repository.deleteUserById(userFound.id);
  }

}