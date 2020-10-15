import { User } from '../entities/User.schema';

export interface IUserService {

  saveUser(user: User): Promise<User>;

  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  findAllUsers(): Promise<User[]>;

  updateUser(user: User): Promise<User>;

  deleteUser(id: string): Promise<void>;

}