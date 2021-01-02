import { UserModule } from './User/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
      envFilePath: '.mysql.env'
    } ),
    TypeOrmModule.forRoot( {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: Number.parseInt( process.env.DB_PORT ),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DBNAME,
      autoLoadEntities: true,
      synchronize: true,
    } ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
