import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './infrastructure/repo/user.repository';
import { User } from './domain/model/user.model';
import { SessionRepository } from './infrastructure/repo/session.repository';
import { Sessions } from './domain/model/session.model';
import { TokenLimitRepository } from './infrastructure/repo/token-limit.repository';
import { TokenLimit } from './domain/model/token-limit.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private tokenLimitRepository: TokenLimitRepository,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, password, username } = createUserDto;
    console.log(createUserDto);
    const exitsingUserEmail = await this.userRepository.findByEmail(email);
    if (exitsingUserEmail) {
      throw new Error('User already exists');
    }
    const existingUserName = await this.userRepository.findByUsername(username);
    if (existingUserName) {
      throw new Error('Username already exists');
    }
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        username,
        password: hashPassword,
      });
      const createdUser = await this.userRepository.create(user);
      const tokens = await this.generateToken(
        createdUser.id,
        createdUser.email,
      );
      await this.updateRefreshToken(createdUser.id, tokens.refreshToken);
      const userData = await this.userRepository.findById(createdUser.id);
      await this.generateTokenLimit(createdUser.id);
      return {
        user: userData,
        ...tokens,
      };
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  private async generateTokenLimit(userId: string): Promise<void> {
    const tokenLimit = TokenLimit.create({ userId });
    await this.tokenLimitRepository.tokenCreate(tokenLimit);
  }

  private async generateToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      this.jwtService.signAsync({ sub: refreshId }, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(userId, hashRefreshToken);
  }

  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const tokens = await this.generateToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user,
      ...tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.logout(userId);
  }

  async login(
    loginDto: {
      email: string;
      password: string;
    },
    req: any,
  ): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    const ipAddress = req.ip;
    const session = Sessions.create({
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ipAddress: ipAddress,
    });
    await this.sessionRepository.createSession(session);

    return {
      user,
      ...tokens,
    };
  }
  async getProfile(userId: string) {
    {
      const tokenLimit = await this.tokenLimitRepository.findByUserId(userId);
      const user = await this.userRepository.findById(userId);
      return {
        user,
        tokenLimit,
      };
    }
  }
  async updateTokenLimit(
    usedId: string,
    usedTokens: number,
    remainingTokens: number,
    tokenUsed: number,
  ): Promise<void> {
    await this.tokenLimitRepository.updateTokenLimit(
      usedId,
      usedTokens,
      remainingTokens,
      tokenUsed,
    );
  }
}
