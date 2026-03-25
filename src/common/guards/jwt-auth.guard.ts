import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 🔐 Protected Routes Guard (JWT Required)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}

/**
 * 🟡 Optional Auth Guard (JWT Optional)
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // No error → guest user allowed
    return user || null;
  }
}



// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractToken(request);

//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }

//     // Token will be validated by JWT strategy in passport
//     return true;
//   }

//   private extractToken(request: any): string | undefined {
//     const authHeader = request.headers.authorization;
//     if (!authHeader) {
//       return undefined;
//     }

//     const [scheme, token] = authHeader.split(' ');
//     if (scheme !== 'Bearer') {
//       return undefined;
//     }

//     return token;
//   }
// }

// @Injectable()
// export class OptionalJwtAuthGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     // This guard always returns true but lets the strategy handle validation
//     return true;
//   }
// }
