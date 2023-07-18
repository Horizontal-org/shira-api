import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { comparePassword, hashPassword } from '../../../utils/password.utils';

import { InvalidCredentailsUserException } from '../exceptions';
import { CredentialUserDto, ReadUserDto } from '../dto';
import {
  ICheckPasswordUserApplication,
  IFindByUsernameUserService,
  TYPES,
} from '../interfaces';

export class CheckPasswordUserApplication
  implements ICheckPasswordUserApplication {

  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameUserService: IFindByUsernameUserService,
  ) {}

  async execute(userCredentials: CredentialUserDto): Promise<ReadUserDto> {
    const errors = await validate(userCredentials);
    if (errors.length > 0) throw new InvalidCredentailsUserException();

    const user = await this.findByUsernameUserService.execute(
      userCredentials.email,
    );

    const mockPassword = await hashPassword(Math.random().toString(36).substring(2, 7));
    const isValid = await comparePassword(
      userCredentials.password,
      user ? user.password : mockPassword,
    );

    if (!isValid || !user) throw new InvalidCredentailsUserException();

    return plainToClass(ReadUserDto, user);
  }
}
