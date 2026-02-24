import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Booking Service API')
    .setDescription(
      `
      ## Cinema Booking Microservice
      
      RESTful API for managing movie bookings and tickets.
      
      ### Features
      - Create and manage bookings
      - Handle tickets for bookings
      - Support multiple booking statuses (PENDING, CONFIRMED, CANCELLED, REFUNDED)
      - User-specific operations with authorization checks
      
      ### Architecture
      Built with Clean Architecture principles:
      - **Domain**: Pure business logic
      - **Application**: Use cases
      - **Infrastructure**: Database and external services
      - **Presentation**: HTTP controllers and DTOs
    `,
    )
    .setVersion('1.0.0')
    .addTag('Bookings', 'Booking management endpoints')
    .addTag('Tickets', 'Ticket management endpoints')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
