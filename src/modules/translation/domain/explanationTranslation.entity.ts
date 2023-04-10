import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Explanation } from 'src/modules/question/domain';
import { Language } from 'src/modules/languages/domain';

@Entity({ name: 'explanations_translations' })
export class ExplanationTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Explanation,
    (explanation: Explanation) => explanation.explanationTranslations,
    {
      // eager: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'explanation_id' })
  explanation: Explanation;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  language: Language;
  @Column({ name: 'language_id' })
  languageId: number;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
