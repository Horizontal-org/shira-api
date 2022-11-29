import { Inject, Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import * as prompt from 'prompt';

import { ReadUserDto } from '../../user/dto';

import {
  ICreateUserApplication,
  TYPES,
} from '../interfaces';

@Injectable()
export class UserCommander {
  constructor(
    @Inject(TYPES.applications.ICreateUserApplication)
    private readonly createUserApplication: ICreateUserApplication,
    private readonly consoleService: ConsoleService,
  ) {
    const cli = this.consoleService.getCli();
    const groupCommand = this.consoleService.createGroupCommand(
      {
        command: 'users',
        description: 'Create, Update, List and Delete users',
      },
      cli,
    )

    this.consoleService.createCommand(
      {
        command: 'create <username>',
        options: [
          {
            flags: '-a, --isAdmin',
            required: false,
          },
        ],
      },
      (username, options: { isAdmin: boolean }) =>
        this.createUser(username, options.isAdmin),
      groupCommand,
    );

    this.consoleService.createCommand(
      {
        command: 'bulk-create',
        description: 'Create a bunch of random users',
      },
      () => this.createUsers(),
      groupCommand,
    );
  }

  async createUser(username: string, isAdmin = false) {
    prompt.start();
    const { password } = await prompt.get(['password']);

    const user = await this.createUserApplication.execute({
      email: username,
      password: password.toString(),
    });

    console.log(`User ${username} was created with id ${user.id}`);
  }

  async createUsers() {
    prompt.start();

    for (let i = 0; i < 10; i++) {
      await this.createUserApplication.execute({
        email: Math.random().toString(36).substring(2, 7) + 'username',
        password: Math.random().toString(36).substring(2, 7) + 'password',
      });
    }

    console.log(`Users created`);
  }

 
}