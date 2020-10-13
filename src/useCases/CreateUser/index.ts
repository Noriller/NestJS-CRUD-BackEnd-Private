import { MailtrapMailProvider } from 'src/providers/implementations/MailtrapMailProvider';
import { MongoUsersRepository } from 'src/repositories/implementations/MongoUsersRepository';
import { CreateUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase';

const mailtrapMailProvider = new MailtrapMailProvider();
const mongoUsersRepository = new MongoUsersRepository();

const createUserUseCase = new CreateUserUseCase(
    mongoUsersRepository,
    mailtrapMailProvider
)

const createUserController = new CreateUserController(
    createUserUseCase
)

export { createUserUseCase, createUserController }