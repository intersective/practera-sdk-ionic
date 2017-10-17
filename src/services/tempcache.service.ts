import { Injectable } from '@angular/core';

export class UserModel {
  id: number;
  milestoneId: number;
  templateId: number;
  name: string;
  description: string;
  videoUrl: string;
  order: number;
  instructions: string;
  isLocked: boolean;
  start: string;
  end: string;
  deadline: string;
  // @TODO: Add more later
}

export class CacheObject {
  user: UserModel;
}

@Injectable()
export class TempCacheService {
  public cache: Object;
  // public storage: Object;

  constructor() {
    this.cache = CacheObject;
  }

  public set(name: string, value: any): void {
    this.cache[name] = value;
    window.localStorage.setItem(name, JSON.stringify(value));
  }

  public get(name: string): any {
    return this.cache[name] || window.localStorage.getItem(name);
  }
}
