import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public password: string,
    public isActive: boolean = true,
    public createdAt: Date,
    public updatedAt: Date,
    public refreshToken?: string,
  ) {}
  static create(details: {
    email: string;
    username: string;
    password: string;
  }): User {
    {
      return new User(
        uuidv4(),
        details.email,
        details.username,
        details.password,
        true,
        new Date(),
        new Date(),
      );
    }
  }
  validatePassword(password: string): void {
    const isPasswordValid = bcrypt.compareSync(password, this.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
  }

  updateRefreshToken(newRefreshToken: string): void {
    this.refreshToken = newRefreshToken;
    this.updatedAt = new Date();
  }

  static ofExisting(data: {
    id: string;
    email: string;
    username: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?: string;
  }): User {
    return new User(
      data.id,
      data.email,
      data.username,
      data.password,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.refreshToken,
    );
  }
}
