import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto'
import { ISubmitRegistrationAuthService } from '../interfaces';
import { RegisterAuthDto } from '../domain/register.auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationEntity } from '../domain/registration.entity';
import { Repository } from 'typeorm';
import { addDays } from 'date-fns';
import { hashPassword } from 'src/utils/password.utils';

@Injectable()
export class SubmitRegistrationAuthService implements ISubmitRegistrationAuthService {
  constructor(
    @InjectRepository(RegistrationEntity)
    private readonly regRepo: Repository<RegistrationEntity>,
  ) {}

  async execute(data: RegisterAuthDto): Promise<void> {
    const registration = new RegistrationEntity()

    //TODO CHECK TIMEZONES createdAt !== expiresAt
  
    const expiresAt = addDays(new Date(), 1) ;

    registration.email = data.email
    registration.passphrase = data.passphrase
    registration.password = await hashPassword(data.password)
    registration.spaceName = data.spaceName    
    registration.expiresAt = expiresAt
    registration.invitationHash = crypto.randomBytes(20).toString('hex') 

    await this.regRepo.save(registration)

    //TODO SEND MAIL
    
    return
  }
}
