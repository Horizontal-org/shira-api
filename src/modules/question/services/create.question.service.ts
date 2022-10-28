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
    private readonly explanationRepo: Repository<Explanation>
  ) {}

  async create (newQuestion: CreateQuestionDto) {
    
    const appEntities =  await this.appRepo.find({where: { id: In(newQuestion.question.apps) }})

    const question = new Question()
    question.name = newQuestion.question.name
    question.content = newQuestion.question.content
    question.isPhising = newQuestion.question.isPhishing
    question.apps = appEntities
    question.fieldOfWork = await this.fieldOfWorkRepo.findOne()
    const saved = await this.questionRepo.save(question)
    
    if (newQuestion.explanations && newQuestion.explanations.length > 0) {
      const explanations = this.explanationRepo.create(newQuestion.explanations.map((nq) => {
        return {
          ...nq,
          question: saved
        }
      }))

      await this.explanationRepo.save(explanations)
    }
  }
}