export class AppException extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class BadRequestException extends AppException {
  constructor(message: string, code?: string, details?: any) {
    super(400, message, code || 'BAD_REQUEST', details);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', code?: string, details?: any) {
    super(401, message, code || 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden', code?: string, details?: any) {
    super(403, message, code || 'FORBIDDEN', details);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends AppException {
  constructor(message: string, code?: string, details?: any) {
    super(404, message, code || 'NOT_FOUND', details);
    this.name = 'NotFoundException';
  }
}

export class ConflictException extends AppException {
  constructor(message: string, code?: string, details?: any) {
    super(409, message, code || 'CONFLICT', details);
    this.name = 'ConflictException';
  }
}

export class ValidationException extends AppException {
  constructor(message: string, code?: string, details?: any) {
    super(422, message, code || 'VALIDATION_ERROR', details);
    this.name = 'ValidationException';
  }
}

export class InternalServerException extends AppException {
  constructor(message: string = 'Internal Server Error', code?: string, details?: any) {
    super(500, message, code || 'INTERNAL_SERVER_ERROR', details);
    this.name = 'InternalServerException';
  }
}
