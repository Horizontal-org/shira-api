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
    const languageId = 1;
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.questionTranslations', 'questionTranslations')
      .select([
        'question.id',
        'question.fieldOfWorkId',
        'question.isPhising',
        'question.name',
        'questionTranslations.content',
        'questionTranslations.languageId',
        'question.createdAt',
        'question.updatedAt',
      ])
      .where('questionTranslations.languageId = :languageId', { languageId })
      .getMany();

    const parsedQuestions = questions.map((question) => ({
      id: question.id,
      name: question.name,
      content: question.questionTranslations[0].content,
      isPhising: question.isPhising,
      fieldOfWorkId: question.fieldOfWorkId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }));

    return parsedQuestions;
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.apps', 'apps')
      .leftJoin('question.explanations', 'explanations')
      .leftJoin('question.questionTranslations', 'questionTranslations')
      .select([
        'question.id',
        'question.name',
        'question.isPhising',
        'question.fieldOfWorkId',
        'apps',
        'questionTranslations.content',
        'explanations.id',
        'explanations.index',
        'explanations.position',
        'explanations.createdAt',
        'explanations.text',
        'explanations.updatedAt',
      ])
      .where('question.id = :id', { id })
      .andWhere('questionTranslations.languageId = :languageId', {
        languageId: 1,
      });

    const res = await query.getOne();
    console.log(res);

    const parsedQuestion = {
      ...res,
      content: res.questionTranslations[0].content,
    };
    return parsedQuestion;
  }
}
