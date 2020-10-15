import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/User.schema';
import { MongoUserService } from './repositories/implementation/MongoUserService';
import { UserController } from './user.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [MongoUserService],
    controllers: [UserController],
})
export class UserModule { }
