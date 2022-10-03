import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App as AppEntity} from '../app/domain';
import { FieldOfWork as FieldOfWorkEntity } from '../field_of_work/domain';
import { Explanation as ExplanationEntity } from '../question/domain'
import { questionControllers } from './controllers';

import { Question as QuestionEntity } from './domain';
import { CreateQuestionService } from './services/create.question.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    QuestionEntity, 
    AppEntity, 
    FieldOfWorkEntity,
    ExplanationEntity
  ])],
  controllers: [...questionControllers],
  providers: [CreateQuestionService]
})
export class QuestionModule {}
