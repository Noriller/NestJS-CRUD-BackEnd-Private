import { User } from 'src/entities/User';

export interface IUsersRepository {
    findByEmail(email: string): Promise<User>;
    save(user: User): Promise<void>;
}