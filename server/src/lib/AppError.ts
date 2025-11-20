export class AppError extends Error {
  statusCode: number;
  isOperational = true; // marks “expected” errors (validation, auth, etc.)
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}