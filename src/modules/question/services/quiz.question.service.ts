import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/modules/app/domain';
import { In, Repository } from 'typeorm';
import { Question } from '../domain';
import { Explanation } from '../domain/explanation.entity';
import { CreateQuestionDto } from '../dto/create.question.dto';
import { Language } from 'src/modules/languages/domain';

@Injectable()
export class GenerateQuizQuestionService {
  private apps;
  private fieldsOfWorkIds;

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async generate(apps, fieldsOfWork, lang: string) {
    const { id: languageId } = await this.languageRepository.findOne({
      where: { code: lang || 'en' },
    });
    this.fieldsOfWorkIds = fieldsOfWork;
    this.apps = await this.appRepository.findByIds(apps);
    const quizQuery = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.apps', 'apps')
      .leftJoin('question.explanations', 'explanations')
      .leftJoin('question.questionTranslations', 'questionTranslations')
      .leftJoin(
        'explanations.explanationTranslations',
        'explanationTranslations',
        'explanations.id = explanationTranslations.explanation_id AND explanationTranslations.language_id = :languageId',
        { languageId },
      )
      .select([
        'question',
        'apps',
        'explanations',
        'questionTranslations.content',
        'explanationTranslations.content',
      ])
      .where('apps.id IN(:...ids)', { ids: apps })
      .andWhere('questionTranslations.languageId = :languageId', {
        languageId,
      })
      .getMany();

    const all = quizQuery.map((question) => ({
      id: question.id,
      name: question.name,
      content: question.questionTranslations[0].content,
      isPhising: question.isPhising,
      fieldOfWorkId: question.fieldOfWorkId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      apps: question.apps.map((app) => ({
        id: app.id,
        name: app.name,
      })),
      explanations: question.explanations.map((explanation) => ({
        ...explanation,
        text: explanation.explanationTranslations[0].content,
      })),
    }));
    let final = [];
    // if 1 app return everything from that app
    if (apps.length === 1) {
      return this.generateOneApp(all);
    }

    if (apps.length > 1) {
      const questionsWithApps = [];
      // get times repeated
      let appCounter = {};
      for (let i = 0; i < all.length; i++) {
        all[i].apps.forEach((a) => {
          const app = appCounter[a.id] || [];
          app.push(all[i].id + '');
          appCounter = {
            ...appCounter,
            [a.id]: app,
          };
        });
      }

      // order repetition
      const repetitionKeys = Object.keys(appCounter).sort((a, b) => {
        return appCounter[a].length - appCounter[b].length;
      });

      const perc = Math.ceil(all.length / apps.length);
      const usedQuestions = [];
      const usedApps = {};

      // start filling based on economy
      for (let i = 0; i < repetitionKeys.length; i++) {
        const appId = repetitionKeys[i];
        // initialize
        if (!usedApps[appId]) {
          usedApps[appId] = 1;
        }

        for (let j = 0; j < appCounter[appId].length; j++) {
          const questionId = appCounter[appId][j];
          const question = all.find((q) => q.id == questionId);
          if (!usedQuestions.includes(questionId) && usedApps[appId] <= perc) {
            questionsWithApps.push({
              ...question,
              apps: null,
              app: this.apps.find((a) => a.id == appId),
            });
            usedQuestions.push(questionId);
            usedApps[appId] = usedApps[appId] + 1;
          }
        }
      }

      final = this.fillFieldsOfWork(questionsWithApps);
      return final;
    }
  }

  private fillFieldsOfWork = (questions) => {
    let final = questions.filter((af) =>
      this.fieldsOfWorkIds.includes(af.fieldOfWorkId),
    );
    const questionsWithoutFieldsOfWork = questions.filter(
      (af) => !this.fieldsOfWorkIds.includes(af.fieldOfWorkId),
    );

    if (final.length > 10) {
      final = final.slice(0, 10);
    }

    if (final.length < 10) {
      const remaining = 10 - final.length;
      for (let i = 0; i < remaining; i++) {
        if (questionsWithoutFieldsOfWork[i]) {
          final.push(questionsWithoutFieldsOfWork[i]);
        }
      }
    }

    return final;
  };

  private generateOneApp = (all) => {
    const app = this.apps[0];

    const appQuestions = all
      .filter((a) => a.apps.find((ap) => ap.id == app.id))
      .map((f) => {
        return {
          ...f,
          apps: null,
          app: app,
        };
      });

    const final = this.fillFieldsOfWork(appQuestions);
    return final;
  };
}
