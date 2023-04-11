import { Body, Param, Patch } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create.question.dto';
import { CreateQuestionService } from '../services/create.question.service';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';

@AuthController('question')
export class EditQuestionController {
  constructor(private createQuestionService: CreateQuestionService) {}

  @Patch(':id')
  async handler(@Param('id') id: string, @Body() question: CreateQuestionDto) {
    const langId = 1;
    this.createQuestionService.create(question, id, langId);
  }
}
