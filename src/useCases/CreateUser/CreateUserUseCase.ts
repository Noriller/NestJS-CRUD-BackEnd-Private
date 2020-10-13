import { User } from 'src/entities/User';
import { IMailProvider } from 'src/providers/IMailProvider';
import { IUsersRepository } from 'src/repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';

export class CreateUserUseCase {

    constructor(
        private usersRepository: IUsersRepository,
        private mailProvider: IMailProvider
    ) { }

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExist = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExist) {
            console.log(userAlreadyExist)
            throw new Error('User already exists.')
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        const message = {
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: "Za Warudo",
                email: "dio@jojo.com",
            },
            subject: "Za Warudo",
            body: "Toki o Tomare!"
        }

        this.mailProvider.sendMail(message)

    }

}