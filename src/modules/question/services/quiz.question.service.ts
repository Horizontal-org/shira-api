import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/modules/app/domain';
import { In, Repository } from 'typeorm';
import { Question } from '../domain';
import { Explanation } from '../domain/explanation.entity';
import { CreateQuestionDto } from '../dto/create.question.dto';


@Injectable()
export class GenerateQuizQuestionService {
  
  private apps
  private fieldsOfWorkIds
  
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
  ) {}

  async generate (apps, fieldsOfWork) {

    this.fieldsOfWorkIds = fieldsOfWork
    this.apps = await this.appRepository.findByIds(apps)
    
    const all = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.apps', 'apps')
      .leftJoinAndSelect('question.explanations', 'explanations')
      .where('apps.id IN(:...ids)', { ids: apps })
      .getMany()

    let final = []
    // if 1 app return everything from that app
    if (apps.length === 1) {
      return this.generateOneApp(all)
    }

    if (apps.length > 1) {
      let questionsWithApps = []
      // get times repeated
      let appCounter = {}
      for (let i = 0; i < all.length; i++) {
        all[i].apps.forEach((a) => {
          let app = appCounter[a.id] || []
          app.push(all[i].id + '')
          appCounter = {
            ...appCounter,
            [a.id]: app
          }
        }) 
      }

      // order repetition
      const repetitionKeys = Object.keys(appCounter).sort((a, b) => {
        return appCounter[a].length - appCounter[b].length
      })

      const perc = Math.ceil(all.length / apps.length)
      let usedQuestions = []
      let usedApps = {}
      
      // start filling based on economy
      for (let i = 0; i < repetitionKeys.length; i++) {
        const appId = repetitionKeys[i]
        // initialize
        if (!usedApps[appId]) {
          usedApps[appId] = 1
        }

        for (let j = 0; j < appCounter[appId].length; j++) {
          const questionId = appCounter[appId][j]
          const question = all.find(q => q.id == questionId)          
          if (!usedQuestions.includes(questionId) && usedApps[appId] <= perc) {
            questionsWithApps.push({
              ...question,
              apps: null,
              app: this.apps.find(a => a.id == appId)
            })
            usedQuestions.push(questionId)
            usedApps[appId] = usedApps[appId] + 1
          }
        }
      }


      final = this.fillFieldsOfWork(questionsWithApps)
      return final;
    }
  }

  private fillFieldsOfWork = (questions) => {

      let final = questions.filter((af) => this.fieldsOfWorkIds.includes(af.fieldOfWorkId))
      let questionsWithoutFieldsOfWork = questions.filter((af) => !this.fieldsOfWorkIds.includes(af.fieldOfWorkId))

      if (final.length > 10) {
        final = final.slice(0, 10)
      }
      
      if (final.length < 10) {
        const remaining = 10 - final.length
        for (let i = 0; i < remaining; i++) {
          if (questionsWithoutFieldsOfWork[i]) {
            final.push(questionsWithoutFieldsOfWork[i])
          }
        }
      }
      
      return final;
  }

  private generateOneApp = (all) => {
    const app = this.apps[0]

    const appQuestions = all.filter((a) => a.apps.find(ap => ap.id == app.id) ).map(f => {
      return {
        ...f,
        apps: null,
        app: app      
      }
    })

    const final = this.fillFieldsOfWork(appQuestions)
    return final
  }
}
