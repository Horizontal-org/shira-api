import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FieldOfWork as FieldOfWorkEntity } from './domain';

@Module({
  imports: [TypeOrmModule.forFeature([FieldOfWorkEntity])],
})
export class MessageTypeModule {}
