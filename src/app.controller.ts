import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { createUserController } from './useCases/CreateUser';
import { Request, Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/user')
  createUser(
    @Req() request: Request,
    @Res() response: Response
  ) {
    return createUserController.handle(
      request, response
    )
  }


}
