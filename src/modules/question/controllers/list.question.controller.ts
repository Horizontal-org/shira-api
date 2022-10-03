import { Controller, Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain';

@Controller('question')
export class ListQuestionController {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  @Get('')
  async handler() {
    const response = this.questionRepository.find()
    return response;
  }
}
