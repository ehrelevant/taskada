import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ValidationError {
  message: string;
  field?: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ValidationError[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const response = exceptionResponse as { message?: string | string[]; error?: string };

        if (Array.isArray(response.message)) {
          message = 'Validation failed';
          errors = response.message.map(msg => ({ message: msg }));
        } else if (typeof response.message === 'string') {
          message = response.message;
        } else if (response.error) {
          message = response.error;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log error for debugging
    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${statusCode}: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${statusCode}: ${message}`);
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
