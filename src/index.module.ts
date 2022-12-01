import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { IndexController } from './index.controller';
import { IndexService } from './index.service';
import { typeOrmModuleOptions } from './ormconfig';
import { AppModule } from './modules/app/app.module';
import { FieldOfWorkModule } from './modules/field_of_work/field_of_work.module'
import { QuestionModule } from './modules/question/question.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConsoleModule } from 'nestjs-console';
import { SurveyModule } from './modules/survey/survey.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AppModule,
    ConsoleModule,
    FieldOfWorkModule,
    QuestionModule,
    UserModule,
    AuthModule,
    SurveyModule
  ],
  controllers: [IndexController],
  providers: [IndexService],
})
export class IndexModule {}
