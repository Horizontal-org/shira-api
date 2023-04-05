import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Explanation } from 'src/modules/question/domain';
import { Language } from 'src/modules/languages/domain';

@Entity()
export class ExplanationTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Explanation, { onDelete: 'CASCADE' })
  explanation: Explanation;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  language: Language;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
