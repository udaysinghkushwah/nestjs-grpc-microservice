import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HeroClientController } from './hero-client.controller';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
  imports: [
    // Register gRPC client proxy named 'HERO_PACKAGE'
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hero',
          protoPath: join(__dirname, 'hero.proto'),
          url: '0.0.0.0:50051',
        },
      },
    ]),
  ],
  controllers: [HeroController, HeroClientController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
