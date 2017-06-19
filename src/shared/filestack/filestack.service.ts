import { Injectable, Optional } from '@angular/core';

declare var filestack: any;
declare var filepicker: any;

@Injectable()
export class FilestackConfig {
  apikey = null;
}

export class FilestackService {
  private filestack: any;
  private filepicker: any;
  version: any;

  constructor(@Optional() config: FilestackConfig) {
    this.filestack = filestack.init(config.apikey);
    this.version = filestack.version;

    this.filepicker = filepicker;
    this.filepicker.setKey(config.apikey);
    console.log(this.filestack);
  }

  pick(file): Promise<any> {
    return this.filestack.pick(file);
  }

  pickV1(file, onSuccess, onError?, onProgress?) {
    this.filepicker.pick(file, success => {
      return onSuccess(success);
    }, onError, onProgress);
  }

  getSecurity() {
    return this.filestack.getSecurity();
  }

  setSecurity (e) {
    return this.filestack.setSecurity(e);
  }

  storeURL (e, t) {
    return this.filestack.storeURL(e, t);
  }

  transform (e, t) {
    return this.filestack.transform(e, t);
  }

  upload (e, t, n, i) {
    return this.filestack.upload(e, t, n, i);
  }

  retrieve (e, t) {
    return this.filestack.retrieve(e, t);
  }

  remove (e) {
    return this.filestack.remove(e);
  }

  metadata (e, t) {
      return this.filestack.metadata(e, t);
  }
}
