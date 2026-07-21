import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { Hero, HeroService } from './hero.interface';

@Controller('heroes')
export class HeroClientController implements OnModuleInit {
  private heroGrpcService: HeroService;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    // Obtain gRPC service proxy created from hero.proto schema
    this.heroGrpcService = this.client.getService<HeroService>('HeroService');
  }

  /**
   * REST GET /heroes/:id
   * Triggers Unary gRPC call to HeroService.FindOne
   */
  @Get(':id')
  getHeroById(@Param('id') id: string): Observable<Hero> {
    console.log(`[REST Gateway :3000] Forwarding Unary gRPC call for hero ID ${id}...`);
    return this.heroGrpcService.findOne({ id: parseInt(id, 10) });
  }

  /**
   * REST GET /heroes/stream/all
   * Triggers Server Streaming gRPC call to HeroService.FindMany
   */
  @Get('stream/all')
  getHeroesStream(): Observable<Hero[]> {
    console.log(`[REST Gateway :3000] Forwarding Server Streaming gRPC call...`);
    // toArray() collects streamed gRPC emission chunks into a response array
    return this.heroGrpcService.findMany({ ids: [1, 2, 3, 4, 5] }).pipe(toArray());
  }
}
