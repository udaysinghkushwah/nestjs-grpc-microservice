import { Observable } from 'rxjs';

export interface HeroById {
  id: number;
}

export interface HeroByIdStream {
  ids: number[];
}

export interface Hero {
  id: number;
  name: string;
  superpower: string;
  level: number;
}

// Client interface representing gRPC HeroService contract for RxJS
export interface HeroService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(data: HeroByIdStream): Observable<Hero>;
}
