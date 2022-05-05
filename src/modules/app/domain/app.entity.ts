import { MessageType } from 'src/modules/message_type/domain/message_type.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'apps' })
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @OneToMany(() => MessageType, (messageType: MessageType) => messageType.app, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_id' })
  messageTypes: MessageType[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
