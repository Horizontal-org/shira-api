import {
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  Body,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthController } from 'src/utils/decorators/auth-controller.decorator';

import { ParserQuestionService } from '../services/individualParser.question.service';
@AuthController('question')
export class ParserQuestionController {
  constructor(private parserQuestionService: ParserQuestionService) {}

  @Get(':id/export/:lang')
  async export(
    @Param('id') id: string,
    @Param('lang') lang: number,
    @Res() res,
  ) {
    this.parserQuestionService.export({ id, lang, res });
  }

  @Post(':id/import')
  @UseInterceptors(FilesInterceptor('files'))
  async import(@UploadedFiles() files, @Body() body: { id: string }) {
    const { id } = body;
    this.parserQuestionService.import({ id, files });
  }
}
