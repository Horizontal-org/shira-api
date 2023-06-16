import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/modules/app/domain';
import { FieldOfWork } from 'src/modules/field_of_work/domain';
import { In, Repository } from 'typeorm';
import { Question } from '../domain';
import { Explanation } from '../domain/explanation.entity';
import { CreateQuestionDto } from '../dto/create.question.dto';
import { QuestionTranslation } from '../../translation/domain/questionTranslation.entity';
import { Language } from 'src/modules/languages/domain';
import { ExplanationTranslation } from '../../translation/domain/explanationTranslation.entity';

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
    @InjectRepository(QuestionTranslation)
    private readonly questionTranslationRepo: Repository<QuestionTranslation>,
    @InjectRepository(ExplanationTranslation)
    private readonly explanationTranslationRepo: Repository<ExplanationTranslation>,
    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {}
  // createOrUpdateQuestion
  async create(newQuestion: CreateQuestionDto, id?: string, langId?: number) {
    let question: Question;
    const fieldOfWork = await this.fieldOfWorkRepo.findOne({
      where: { id: newQuestion.question.fieldOfWork },
    });
    const appEntities = await this.appRepo.find({
      where: { id: In(newQuestion.question.apps) },
    });
    // find language by languageId
    const language = await this.languageRepo.findOne({
      where: { id: langId },
    });

    if (id) {
      question = await this.questionRepo.findOne({
        where: { id },
      });
    } else {
      question = new Question();
    }
    question.name = newQuestion.question.name;
    question.isPhising = newQuestion.question.isPhishing;
    question.apps = appEntities;
    question.fieldOfWork = fieldOfWork;
    question.languageId = langId;
    question.content = '';
    const saved = await this.questionRepo.save(question);

    // create or update questionTranslation based on questionId and languageId
    const questionTranslation = await this.questionTranslationRepo.findOne({
      where: { question: saved, languageId: language },
    });
    if (questionTranslation) {
      questionTranslation.content = newQuestion.question.content;
      await this.questionTranslationRepo.save(questionTranslation);
    } else {
      const newQuestionTranslation = new QuestionTranslation();
      newQuestionTranslation.content = newQuestion.question.content;
      newQuestionTranslation.question = saved;
      newQuestionTranslation.languageId = langId;
      await this.questionTranslationRepo.save(newQuestionTranslation);
    }

    if (newQuestion.explanations && newQuestion.explanations.length > 0) {
      const questionId = saved.id;

      const query = `
        SELECT id
        FROM explanations
        WHERE question_id = ?;
      `;

      const results = await this.explanationRepo.query(query, [questionId]);

      const explanationsToDelete = results.filter((oldExp) => {
        return !newQuestion.explanations.some(
          (newExp) => newExp.id === oldExp.id,
        );
      });

      for (const explanation of explanationsToDelete) {
        await this.explanationRepo.delete(explanation.id);
      }

      for (const newExplanation of newQuestion.explanations) {
        const explanation = await this.explanationRepo.findOne({
          where: { id: newExplanation.id },
        });

        if (explanation) {
          explanation.position = newExplanation.position;
          explanation.index = newExplanation.index;
          await this.explanationRepo.save(explanation);

          const explanationTranslation =
            await this.explanationTranslationRepo.findOne({
              where: { explanation: explanation.id, languageId: language },
            });
          explanationTranslation.content = newExplanation.text;
          await this.explanationTranslationRepo.save(explanationTranslation);
        } else {
          const savedExplanation = await this.explanationRepo.save(
            this.explanationRepo.create({
              position: newExplanation.position,
              index: newExplanation.index,
              question: saved,
            }),
          );

          const newExplanationTranslation =
            this.explanationTranslationRepo.create({
              explanation: savedExplanation,
              content: newExplanation.text,
              languageId: langId,
            });
          await this.explanationTranslationRepo.save(newExplanationTranslation);
        }
      }
    }
  }
}
