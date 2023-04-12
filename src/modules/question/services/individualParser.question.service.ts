import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain';
import { QuestionTranslation } from 'src/modules/translation/domain/questionTranslation.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ParserQuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionTranslation)
    private readonly QuestionTranslationRepository: Repository<QuestionTranslation>,
  ) {}
  // createOrUpdateQuestion
  async export({ id, lang, res }) {
    const languageId = lang || 1;
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.explanations', 'explanations')
      .leftJoin('question.questionTranslations', 'questionTranslations')
      .leftJoin(
        'explanations.explanationTranslations',
        'explanationTranslations',
        'explanations.id = explanationTranslations.explanation_id AND explanationTranslations.language_id = :languageId',
        { languageId },
      )
      .select([
        'question.id',
        'question.name',
        'explanations.id',
        'questionTranslations.content',
        'explanationTranslations.content',
      ])
      .where('question.id = :id', { id })
      .andWhere('questionTranslations.languageId = :languageId', {
        languageId,
      });

    const resData = await query.getOne();

    const questionTranslationContent = resData.questionTranslations[0].content;
    const fileName = `question_${id}_translation_${languageId}.html`;
    const filePath = path.join(__dirname, '..', fileName);
    fs.writeFile(filePath, questionTranslationContent, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send('Failed to export question translation content');
      } else {
        console.log(`Question translation content exported to ${filePath}`);
        return res.download(filePath, (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send('Failed to download question translation content');
          }
          // delete the file after downloading
          fs.unlinkSync(filePath);
        });
      }
    });
  }

  async import({ id, lang, file }) {
    console.log(id);
    console.log(lang);

    const fileName = `question_${id}_translation_${lang}.html`;
    const filePath = path.join(__dirname, '..', fileName);

    // Save the uploaded file to the server
    fs.writeFileSync(filePath, file.buffer);

    // Read the HTML file contents
    const fileContents = fs.readFileSync(filePath, 'utf-8');

    console.log(fileContents);

    // find a questionTranslation with id as question is and lang. If does not exist create it
    const questionTranslated = await this.QuestionTranslationRepository.findOne(
      {
        where: { question: id, languageId: lang },
      },
    );

    if (!questionTranslated) {
      // create new questionTranslation with new fileContents
      const questionTranslation = new QuestionTranslation();
      questionTranslation.content = fileContents;
      questionTranslation.languageId = lang;
      questionTranslation.question = id;
      await this.QuestionTranslationRepository.save(questionTranslation);
      fs.unlinkSync(filePath);
      return { message: 'Question translation imported successfully' };
    }

    // edit questionTranslation with new fileContents
    questionTranslated.content = fileContents;
    await this.QuestionTranslationRepository.save(questionTranslated);
    fs.unlinkSync(filePath);

    return { message: 'Question translation imported successfully' };
    s;
  }
}
