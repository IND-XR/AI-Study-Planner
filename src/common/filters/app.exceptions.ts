/**
 * Custom Application Exception Class
 */
export class AppException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppException.prototype);
  }
}

/**
 * Common custom exceptions
 */
export class BadRequestException extends AppException {
  constructor(message: string, details?: any) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(401, message, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden', details?: any) {
    super(403, message, 'FORBIDDEN', details);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = 'Not Found', details?: any) {
    super(404, message, 'NOT_FOUND', details);
  }
}

export class ConflictException extends AppException {
  constructor(message: string = 'Conflict', details?: any) {
    super(409, message, 'CONFLICT', details);
  }
}

export class ValidationException extends AppException {
  constructor(message: string = 'Validation Error', details?: any) {
    super(422, message, 'VALIDATION_ERROR', details);
  }
}

export class InternalServerException extends AppException {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}
