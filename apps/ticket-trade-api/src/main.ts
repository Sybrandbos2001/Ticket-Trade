import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  try {
    Logger.log('🚀 Starting application bootstrap...', 'Bootstrap');
    const app = await NestFactory.create(AppModule);
    Logger.log('✅ NestJS application instance created', 'Bootstrap');

    // Configure global validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }));
    Logger.log('✅ Global validation pipe configured', 'Bootstrap');

    // Set global prefix for the API
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    Logger.log(`✅ Global prefix set to: /${globalPrefix}`, 'Bootstrap');

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Ticket Trade API')
      .setDescription('API voor het beheren van tickets, gebruikers, concerten, etc.')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    Logger.log('✅ Swagger module configured at /api/docs', 'Bootstrap');

    // Start the application
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://127.0.0.1:${port}/${globalPrefix}`, 'Bootstrap');
    Logger.log(`📚 Swagger docs available at: http://127.0.0.1:${port}/${globalPrefix}/docs`, 'Bootstrap');    

  } catch (error) {
    Logger.error('❌ Failed to bootstrap the application', error, 'Bootstrap');
    process.exit(1);
  }
}

bootstrap();
