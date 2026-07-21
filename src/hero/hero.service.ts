import { Injectable } from '@nestjs/common';
import { Hero, HeroById } from './hero.interface';

@Injectable()
export class HeroService {
  private readonly heroes: Hero[] = [
    { id: 1, name: 'Iron Man', superpower: 'Genius, Powered Armor', level: 95 },
    { id: 2, name: 'Spider-Man', superpower: 'Spider-sense, Agility', level: 88 },
    { id: 3, name: 'Thor', superpower: 'God of Thunder, Mjolnir', level: 99 },
    { id: 4, name: 'Captain America', superpower: 'Super Soldier, Vibranium Shield', level: 90 },
    { id: 5, name: 'Doctor Strange', superpower: 'Master of Mystical Arts', level: 96 },
  ];

  findOne(data: HeroById): Hero {
    const hero = this.heroes.find((h) => h.id === Number(data.id));
    if (!hero) {
      return { id: data.id, name: 'Unknown Hero', superpower: 'None', level: 0 };
    }
    return hero;
  }

  findManyByIds(ids: number[]): Hero[] {
    if (!ids || ids.length === 0) return this.heroes;
    const numIds = ids.map((id) => Number(id));
    return this.heroes.filter((h) => numIds.includes(h.id));
  }
}
