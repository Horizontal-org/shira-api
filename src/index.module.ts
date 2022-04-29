import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { IndexController } from './index.controller';
import { IndexService } from './index.service';
import { typeOrmModuleOptions } from './ormconfig';
import { AppModule } from './modules/app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AppModule,
  ],
  controllers: [IndexController],
  providers: [IndexService],
})
export class IndexModule {}
