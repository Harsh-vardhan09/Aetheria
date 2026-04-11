import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: 'Validation error', code: 400 });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format', code: 400 });
  }

  res.status(500).json({ success: false, error: 'Internal server error', code: 500 });
};

export default errorHandler;