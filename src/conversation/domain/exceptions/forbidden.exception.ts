import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(id: string) {
    super(
      {
        message: `user not matches ${id}'s conversation`,
        errorCode: `FORBIDDEN`,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
