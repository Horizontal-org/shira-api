import { Body, Post } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create.question.dto';
import { CreateQuestionService } from '../services/create.question.service';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';

@AuthController('question')
export class CreateQuestionController {
  constructor(private createQuestionService: CreateQuestionService) {}

  @Post('')
  async handler(@Body() newQuestion: CreateQuestionDto) {
    this.createQuestionService.create(newQuestion);
  }
}
