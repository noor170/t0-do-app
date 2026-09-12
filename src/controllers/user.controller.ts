// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import AppError from '../utils/AppError';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('REQUEST BODY:', req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return next(new AppError('Email already in use', 409));
    }

    const newUser = await UserService.create(email, password);

    return res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    return next(new AppError(error.message || 'Failed to create user', error.statusCode || 500));
  }
};