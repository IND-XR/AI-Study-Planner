import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from './app.exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    // Handle custom AppException
    if (exception instanceof AppException) {
      status = exception.statusCode;
      message = exception.message;
      code = exception.code;
      details = exception.details;
    }
    // Handle NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const response = exceptionResponse as any;
        message = response.message || exception.message;
        code = response.code || 'HTTP_EXCEPTION';
      } else {
        message = exceptionResponse as string;
      }
    }
    // Handle validation errors
    else if (
      exception instanceof Error &&
      exception.name === 'ValidationPipeError'
    ) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Validation Error';
      code = 'VALIDATION_ERROR';
      details = (exception as any).getResponse()?.message;
    }
    // Log unexpected errors
    else if (exception instanceof Error) {
      this.logger.error({
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
        url: request.url,
        method: request.method,
      });
      message = 'Internal Server Error';
    }

    const errorResponse = {
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(details && { details }),
      ...(process.env.APP_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    response.status(status).json(errorResponse);
  }
}
