import { Controller, Get, Inject, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
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
  async handler(@Query('apps', new ParseArrayPipe({ optional: true })) apps = []) {

    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect("question.apps", "apps")
      .leftJoinAndSelect("question.explanations", "explanations")
      .take(10)
      
    // console.log("🚀 ~ file: list.question.controller.ts:23 ~ ListQuestionController ~ handler ~ apps", apps)
    // if (apps.length > 0) {
    //   query.where('apps.id IN(:...ids)', {ids: apps})
    // }
    const response = await query.getMany()


    return response;
  }
}
