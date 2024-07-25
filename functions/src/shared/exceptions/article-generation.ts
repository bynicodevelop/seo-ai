export class ArticleGenerationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArticleGenerationException';
  }
}