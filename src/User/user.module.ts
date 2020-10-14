import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/User.schema';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserController } from './user.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [MongoUserRepository],
    controllers: [UserController],
})
export class UserModule { }
