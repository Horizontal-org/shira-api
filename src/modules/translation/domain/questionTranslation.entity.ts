import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from '../../question/domain/question.entity';
import { Language } from '../../languages/domain/languages.entity';

@Entity({ name: 'questions_translations' })
export class QuestionTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Question,
    (question: Question) => question.questionTranslations,
    {
      // eager: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(
    () => Language,
    (language: Language) => language.questionTranslations,
    {
      // eager: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'language_id' })
  languageId: number;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
