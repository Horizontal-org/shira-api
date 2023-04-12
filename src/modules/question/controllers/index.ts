import { CreateQuestionController } from './create.question.controller';
import { ListQuestionController } from './list.question.controller';
import { DeleteQuestionController } from './delete.question.controller';
import { QuizQuestionController } from './quiz.question.controller';
import { EditQuestionController } from './edit.question.controller';
import { ParserQuestionController } from './parser.question.controller';
export const questionControllers = [
  QuizQuestionController,
  CreateQuestionController,
  ListQuestionController,
  DeleteQuestionController,
  EditQuestionController,
  ParserQuestionController,
];
