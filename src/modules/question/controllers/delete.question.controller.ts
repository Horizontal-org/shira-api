import { Controller, Delete, Get, Inject, Param, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';
import { Repository } from 'typeorm';
import { Question } from '../domain';

@AuthController('question')
export class DeleteQuestionController {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  @Delete(':id')
  async handler(@Param('id') id: string) {

    await this.questionRepository.delete(id)      

    return true;
  }
}
