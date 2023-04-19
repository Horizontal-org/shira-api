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
import { GlobalParserQuestionService } from '../services/globalParser.question.service';
@AuthController('question')
export class ParserQuestionController {
  constructor(
    private parserQuestionService: ParserQuestionService,
    private globalParserQuestionService: GlobalParserQuestionService,
  ) {}

  @Get(':id/export/:lang')
  async export(
    @Param('id') id: string,
    @Param('lang') lang: string,
    @Res() res,
  ) {
    this.parserQuestionService.export({ id, lang, res });
  }

  @Get('/global-export/:lang')
  async globalExport(
    @Param('id') id: string,
    @Param('lang') lang: string,
    @Res() res,
  ) {
    this.globalParserQuestionService.export({ lang, res });
  }

  @Post(':id/import')
  @UseInterceptors(FilesInterceptor('files'))
  async import(
    @UploadedFiles() files,
    @Body() body: { id: string },
    @Res() res,
  ) {
    const { id } = body;
    this.parserQuestionService.import({ id, files, res });
  }

  @Post('/global-import')
  @UseInterceptors(FilesInterceptor('files'))
  async globalImport(@UploadedFiles() files, @Res() res) {
    this.globalParserQuestionService.import({ files, res });
  }
}
