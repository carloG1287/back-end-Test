import { Request, Response, NextFunction } from 'express';

interface AppError {
  statusCode: number;
  message: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({ message });
};
