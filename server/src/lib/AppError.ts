/**
 * AppError
 * ------------------------------------------------------------
 * Custom application error class used to standardize
 * predictable, operational errors across the backend.
 *
 * Purpose:
 *  - Distinguish between "expected" errors (auth failures,
 *    validation issues, missing resources) and unexpected
 *    system errors.
 *  - Provide a consistent `statusCode` for the global
 *    error handler to send proper HTTP responses.
 *
 * Usage:
 *  throw new AppError("User not found", 404)
 *
 * Notes:
 *  - `isOperational` flags errors that should not crash
 *    the server and are safe to expose to clients.
 */
export class AppError extends Error {
  statusCode: number;
  isOperational = true;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}