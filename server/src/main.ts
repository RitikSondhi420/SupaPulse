import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SupaPulseBootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 4000;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  // Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`⚡ SupaPulse NestJS GraphQL Backend is running!`);
  logger.log(`📡 Server Port:         http://localhost:${port}`);
  logger.log(`🚀 GraphQL Playground:   http://localhost:${port}/graphql`);
  logger.log(`🔒 Default Admin Email: admin@supapulse.io`);
  logger.log(`🔑 Default Admin Pass:  admin123`);
  logger.log(`=======================================================`);
}

bootstrap();
