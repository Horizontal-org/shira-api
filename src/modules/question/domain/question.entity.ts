import { App } from 'src/modules/app/domain';
import { FieldOfWork } from 'src/modules/field_of_work/domain';
import { MessageType } from 'src/modules/message_type/domain/message_type.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Explanation } from './explanation.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({ name: 'is_phising' })
  isPhising: Number;

  @ManyToOne(() => FieldOfWork, (fieldOfWork: FieldOfWork) => fieldOfWork.questions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'field_of_work_id'})
  fieldOfWork: FieldOfWork;

  @ManyToMany(() => App, app => app.questions)
  @JoinTable({
    name: 'apps_questions',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'app_id',
      referencedColumnName: 'id',
    }
  })
  apps: App[];

  @OneToMany(() => Explanation, (explanation: Explanation) => explanation.question)
  explanations: Explanation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
