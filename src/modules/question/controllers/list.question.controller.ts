import { Controller, Get, Param, ParseArrayPipe, Query } from '@nestjs/common';
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
    const questions = await this.questionRepository
      .createQueryBuilder('question')      
      .getMany()


    return questions;
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.apps', 'apps')
      .leftJoinAndSelect('question.explanations', 'explanations')
      .where('question.id = :id', { id });

    const res = await query.getOne();
    return res;
  }
}