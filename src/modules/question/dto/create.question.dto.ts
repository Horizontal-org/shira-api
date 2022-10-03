export class CreateQuestionDto {
  question: {
    content: string;
    isPhishing: number;
    fieldOfWork?: string;
    apps: string[];
  }
  explanations?: {
    position: string;
    text: string;
  }[]
}