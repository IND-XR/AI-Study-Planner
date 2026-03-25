import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cors from 'cors';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { RequestTimeoutInterceptor } from '@common/interceptors/request-timeout.interceptor';
import { ResponseTransformInterceptor } from '@common/interceptors/response-transform.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 🔐 Security middleware
  app.use(helmet());

  // ✅ ENV BASED ORIGINS (BEST PRACTICE)
  const allowedOrigins = [
    configService.get<string>('FRONTEND_URL'), // production
    'http://localhost:3001', // dev frontend
  ].filter(Boolean);

  // ✅ FINAL CORS SETUP (NO ERROR GUARANTEED)
  app.use(
    cors({
      origin: (origin, callback) => {
        // ✅ allow Postman / mobile apps
        if (!origin) return callback(null, true);

        // ✅ allow known origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // ❌ block others (secure SaaS)
        console.warn(`❌ Blocked by CORS: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },

      credentials: true,

      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
      ],

      exposedHeaders: ['Authorization'],

      optionsSuccessStatus: 204,
    }),
  );

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseTransformInterceptor(),
    new RequestTimeoutInterceptor(),
  );

  // ✅ Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 🚀 Start server
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);

  // 🔥 Clean logs
  console.log(`🚀 Server running: http://localhost:${port}`);
  console.log(`🌍 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`📦 Environment: ${configService.get('APP_ENV')}`);
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});





// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import helmet from 'helmet';
// import cors from 'cors';
// import { AppModule } from './app.module';
// import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
// import { RequestTimeoutInterceptor } from '@common/interceptors/request-timeout.interceptor';
// import { ResponseTransformInterceptor } from '@common/interceptors/response-transform.interceptor';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);

//   // Security middleware
//   app.use(helmet());
//   app.use(cors({
//     origin: configService.get('FRONTEND_URL') || 'http://localhost:3001',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   }));

//   // Global validation pipe
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//     }),
//   );

//   // Global interceptors
//   app.useGlobalInterceptors(
//     new ClassSerializerInterceptor(app.get('Reflector')),
//     new ResponseTransformInterceptor(),
//     new RequestTimeoutInterceptor(),
//   );

//   // Global exception filter
//   app.useGlobalFilters(new GlobalExceptionFilter());

//   const port = configService.get('APP_PORT') || 3000;
//   await app.listen(port);

//   console.log(`🚀 Application is running on: http://localhost:${port}`);
//   console.log(`📚 AI Study Planner Backend - ${configService.get('APP_ENV')} environment`);
// }

// bootstrap().catch((error) => {
//   console.error('❌ Application failed to start:', error);
//   process.exit(1);
// });
