import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Create standard HTTP NestJS web application
  const app = await NestFactory.create(AppModule);

  // 2. Connect gRPC Microservice transport layer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, 'hero/hero.proto'),
      url: '0.0.0.0:50051',
    },
  });

  // 3. Start all connected microservices
  await app.startAllMicroservices();
  console.log('🚀 gRPC Microservice listener running on 0.0.0.0:50051');

  // 4. Start HTTP REST Gateway listener
  const PORT = process.env.PORT || 3050;
  await app.listen(PORT);
  console.log(`🌐 HTTP REST Gateway running on http://localhost:${PORT}`);
  console.log(`   └─ Test Unary gRPC call:   GET http://localhost:${PORT}/heroes/1`);
  console.log(`   └─ Test Streaming gRPC:    GET http://localhost:${PORT}/heroes/stream/all`);
}
bootstrap();
