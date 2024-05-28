import { Request, Response, NextFunction } from 'express';

interface AppError {
  statusCode: number;
  message: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error to console for debugging purposes

  // Extract error information or provide a default message if not available
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  // Return an HTTP response with the status code and error message
  res.status(statusCode).json({ message });
};
