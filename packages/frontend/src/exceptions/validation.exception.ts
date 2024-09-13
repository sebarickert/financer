export class ValidationException extends Error {
  readonly errors: string[];

  constructor(message: string, errors: string | string[] = []) {
    super(message);
    this.name = 'ValidationException';

    this.errors = Array.isArray(errors) ? errors : [errors];
  }
}
