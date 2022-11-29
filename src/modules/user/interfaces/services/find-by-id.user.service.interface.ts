import { UserEntity } from '../../domain/user.entity';

export interface IFindByIdUserService {
  execute(userId: string): Promise<UserEntity>;
}
