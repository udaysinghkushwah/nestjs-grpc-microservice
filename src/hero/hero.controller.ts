import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, from } from 'rxjs';
import { Hero, HeroById, HeroByIdStream } from './hero.interface';
import { HeroService } from './hero.service';

@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  /**
   * Unary RPC Handler: FindOne
   */
  @GrpcMethod('HeroService', 'FindOne')
  findOne(data: HeroById): Hero {
    console.log(`[gRPC Server :50051] Received Unary Request for Hero ID: ${data.id}`);
    return this.heroService.findOne(data);
  }

  /**
   * Server Streaming RPC Handler: FindMany
   * Returning an RxJS Observable from @GrpcMethod handles Server Streaming RPC in NestJS
   */
  @GrpcMethod('HeroService', 'FindMany')
  findMany(data: HeroByIdStream): Observable<Hero> {
    console.log(`[gRPC Server :50051] Received Streaming Request for Hero IDs: ${data.ids?.join(', ') || 'ALL'}`);
    const heroes = this.heroService.findManyByIds(data.ids);
    return from(heroes);
  }
}
