import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { QuestionTranslation } from '../../translation/domain/questionTranslation.entity';
import { ExplanationTranslation } from '../../translation/domain/explanationTranslation.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(
    () => QuestionTranslation,
    (questionTranslation: QuestionTranslation) => questionTranslation.question,
  )
  questionTranslations: QuestionTranslation[];

  @OneToMany(
    () => ExplanationTranslation,
    (explanationTranslation: ExplanationTranslation) =>
      explanationTranslation.explanation,
  )
  explanationTranslations: ExplanationTranslation[];
}
