import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Exclude()
@Entity({ name: 'users' })
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ length: 80 })
  email: string;

  @Column()
  password: string;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;
}
