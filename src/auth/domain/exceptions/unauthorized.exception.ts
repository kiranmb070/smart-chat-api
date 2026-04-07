import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(id: string) {
    super(
      {
        message: `Resource with ID ${id} not found`,
        errorCode: 'RESOURCE_NOT_FOUND',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
