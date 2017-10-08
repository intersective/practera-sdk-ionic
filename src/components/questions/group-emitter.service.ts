import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class GroupEmitterService {
  private static _emitter: { [ID: string]: EventEmitter<any> };

  static get(ID: string): EventEmitter<any> {
    if (!this._emitter[ID]) {
      this._emitter[ID] = new EventEmitter();
    }
    return this._emitter[ID];
  }
}

