import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { hashPassword } from '../../../utils/password.utils';

import { CreateUserDto, ReadUserDto } from '../dto';
import {
  TYPES,
  ICreateUserApplication,
  ICreateUserService,
} from '../interfaces';

@Injectable()
export class CreateUserApplication implements ICreateUserApplication {
  constructor(
    @Inject(TYPES.services.ICreateUserService)
    private readonly createUserService: ICreateUserService,
  ) {}
  async execute(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const password = await hashPassword(createUserDto.password);
    let user = null
    try {
      user = await this.createUserService.execute({
        ...createUserDto,
        password,
      });
    } catch (e) {
      console.log("🚀 ~ file: create.user.application.ts ~ line 30 ~ CreateUserApplication ~ execute ~ e", e)      
    }

    return plainToClass(ReadUserDto, user);
  }
}
