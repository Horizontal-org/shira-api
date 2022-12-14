import { Delete, Param, ParseIntPipe } from '@nestjs/common';
import { DeleteQuestionDto } from '../dto/delete.question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';
import { Repository } from 'typeorm';
import { Question } from '../domain';

@AuthController('question')
export class DeleteQuestionController {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  @Delete(':id')
  async handler(
    @Param('id', ParseIntPipe)
    id: DeleteQuestionDto,
  ) {
    await this.questionRepository.delete(id);

    return true;
  }
}
