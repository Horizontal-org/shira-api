import { Controller, Delete, Get, Inject, Param, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain';

@Controller('question')
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
