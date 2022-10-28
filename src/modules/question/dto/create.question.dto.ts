export class CreateQuestionDto {
  question: {
    name: string;
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