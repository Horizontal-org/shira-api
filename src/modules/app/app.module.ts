import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEntity } from './domain';

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity])],
})
export class AppModule {}
