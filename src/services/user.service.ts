// src/services/user.service.ts
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError';

export class UserService {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async create(email: string, password: string) {
    if (!password) {
      throw new AppError('Password is required for hashing', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true },
    });
  }
}
