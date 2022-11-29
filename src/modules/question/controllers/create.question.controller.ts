import { Body, Controller, Get, Inject, ParseIntPipe, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/create.question.dto';
import { Question } from '../domain';
import { App } from 'src/modules/app/domain';
import { CreateQuestionService } from '../services/create.question.service';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';

@AuthController('question')
export class CreateQuestionController {
  constructor(
    private createQuestionService: CreateQuestionService
  ) {}

  @Post('')
  async handler(@Body() newQuestion: CreateQuestionDto) {
    this.createQuestionService.create(newQuestion)
  }
}
