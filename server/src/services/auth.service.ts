import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';
import { toPublicUser, type PublicUser } from '../models/user.model.js';

const SALT_ROUNDS = 10;

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export const authService = {
  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const row = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
    });

    const user = toPublicUser(row);
    return { user, token: signToken(user) };
  },

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const row = await userRepository.findByEmail(input.email);
    // Same generic message whether email or password is wrong (avoids user enumeration).
    if (!row) {
      throw AppError.unauthorized('The email or password you entered is incorrect');
    }

    const isValid = await bcrypt.compare(input.password, row.password_hash);
    if (!isValid) {
      throw AppError.unauthorized('The email or password you entered is incorrect');
    }

    const user = toPublicUser(row);
    return { user, token: signToken(user) };
  },

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const row = await userRepository.findById(userId);
    if (!row) throw AppError.notFound('User no longer exists');
    return toPublicUser(row);
  },

  async changePassword(input: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<PublicUser> {
    const row = await userRepository.findById(input.userId);
    if (!row) throw AppError.notFound('User no longer exists');

    const isValid = await bcrypt.compare(input.currentPassword, row.password_hash);
    if (!isValid) {
      throw AppError.badRequest('Your current password is incorrect');
    }

    const sameAsOld = await bcrypt.compare(input.newPassword, row.password_hash);
    if (sameAsOld) {
      throw AppError.badRequest('New password must be different from the current one');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await userRepository.updatePassword(row.id, passwordHash);
    return toPublicUser(row);
  },
};
