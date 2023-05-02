import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './domain/languages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [],
  providers: [],
})
export class LanguageModule {}
