/**
 * catchAsync
 * ------------------------------------------------------------
 * Higher-order wrapper for async Express route handlers.
 *
 * Purpose:
 *  - Eliminates repetitive try/catch blocks in controllers.
 *  - Ensures any async error is automatically passed to
 *    Express's global error handler via `next(err)`.
 *  - Prevents unhandled Promise rejections which can crash
 *    the server.
 *
 * How it works:
 *  - Takes an async controller (fn)
 *  - Returns a new function that calls the controller and
 *    wraps it in `Promise.resolve(...)`
 *  - If the controller throws or rejects, `.catch(next)`
 *    forwards the error into Express's error pipeline.
 *
 * Usage:
 *   export const getUser = catchAsync(async (req, res) => {
 *     const user = await User.findById(req.params.id);
 *     res.json(user);
 *   });
 *
 * Result:
 *   Controllers stay clean, and all errors are centralized.
 */
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync =
  (
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };