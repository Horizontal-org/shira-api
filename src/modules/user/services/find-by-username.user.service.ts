import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain/user.entity';
import { NotFoundUserException } from '../exceptions';
import { IFindByUsernameUserService } from '../interfaces';
import { UnauthorizedException } from '@nestjs/common';

export class FindByUsernameUserService implements IFindByUsernameUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email: username } });

    return user;
  }
}
