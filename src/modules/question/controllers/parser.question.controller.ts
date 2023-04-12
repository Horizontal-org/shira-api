import {
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @UploadedFile() file,
    @Body() body: { id: string; lang: number },
  ) {
    const { id, lang } = body;
    this.parserQuestionService.import({ id, lang, file });
  }
}
