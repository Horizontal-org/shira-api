import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/modules/app/domain';
import { FieldOfWork } from 'src/modules/field_of_work/domain';
import { In, Repository } from 'typeorm';
import { Question } from '../domain';
import { Explanation } from '../domain/explanation.entity';
import { CreateQuestionDto } from '../dto/create.question.dto';

@Injectable()
export class CreateQuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
    @InjectRepository(FieldOfWork)
    private readonly fieldOfWorkRepo: Repository<FieldOfWork>,
    @InjectRepository(Explanation)
    private readonly explanationRepo: Repository<Explanation>,
  ) {}

  async create(newQuestion: CreateQuestionDto, id?: string) {
    let question: Question;
    const fieldOfWork = await this.fieldOfWorkRepo.findOne({ where: { id: newQuestion.question.fieldOfWork }})
    const appEntities = await this.appRepo.find({
      where: { id: In(newQuestion.question.apps) },
    });

    if (id) {
      question = await this.questionRepo.findOne({
        where: { id },
      });
    } else {
      question = new Question();
    }
    question.name = newQuestion.question.name;
    question.content = newQuestion.question.content;
    question.isPhising = newQuestion.question.isPhishing;
    question.apps = appEntities;
    question.fieldOfWork = fieldOfWork
    const saved = await this.questionRepo.save(question);

    if (newQuestion.explanations && newQuestion.explanations.length > 0) {
      // removes old explanations to prevent duplicates
      this.explanationRepo.delete({ question: saved });
      // create new explanations
      const explanationsArray = this.explanationRepo.create(
        newQuestion.explanations.map((nq) => {
          return {
            ...nq,
            question: saved,
          };
        }),
      );
      return this.explanationRepo.save(explanationsArray);
    }
  }
}
