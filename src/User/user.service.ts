import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
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
    const tryToFindUser = await this.repository.findUserByEmail(user.email);

    if (user.id || tryToFindUser)
      throw new BadRequestException(`User already exists. Can't save.`);

    user.password = await generateHashPassword(user.password);

    const userToSave = new User(user);

    const savedUser = await this.repository.saveUser(userToSave);

    if (!savedUser)
      throw new ServiceUnavailableException(`Failed to save user.`);

    return savedUser;

  }

  async findUserByEmail(email: string): Promise<User> {
    if (!email)
      throw new BadRequestException("Email cannot be empty.");

    const userFound = await this.repository.findUserByEmail(email);

    if (!userFound)
      throw new NotFoundException('User not found.');

    return userFound;
  }

  async findAllUsers(): Promise<User[]> {
    const usersFound = await this.repository.findAllUsers();

    if (usersFound.length == 0)
      return [];

    return usersFound;
  }

  async updateUser(originalEmail: string, newUserInfo: UserDTO): Promise<User> {
    if (!originalEmail)
      throw new BadRequestException('Must provide original email.');

    if (!newUserInfo.id) {
      const userFound = await this.findUserByEmail(originalEmail);
      newUserInfo.id = userFound.id;
    }

    newUserInfo.password = await generateHashPassword(newUserInfo.password);

    const userToUpdate = new User(newUserInfo);

    const userUpdated = await this.repository.updateUserById(userToUpdate);

    if (!userUpdated)
      throw new ServiceUnavailableException('Server Error while saving data.');

    return userUpdated;
  }

  async deleteUser(email: string): Promise<User> {
    if (!email)
      throw new BadRequestException("Email cannot be empty.");

    const userFound = await this.repository.findUserByEmail(email);

    const userDeleted = await this.repository.deleteUserById(userFound.id);

    if (!userDeleted)
      throw new ServiceUnavailableException('User could not be deleted.');

    return userDeleted;
  }

}