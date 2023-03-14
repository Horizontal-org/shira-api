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
  async handler(
    @Query(
      'apps',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    apps = [],
  ) {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.apps', 'apps')
      .leftJoinAndSelect('question.explanations', 'explanations')
      .take(10);

    if (apps.length > 0) {
      query.where('apps.id IN(:...ids)', { ids: apps });
    }
    const response = await query.getMany();

    return response;
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
