import { Injectable, Optional } from '@angular/core';

declare var filestack: any;
declare var filepicker: any;

export class FilestackUpload {
  filesFailed: Array<any>;
  filesUploaded: Array<any>;
}

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
  }

  /**
   * display pick/upload popup for file upload,
   * refer to filestack documentation for more config information
   * @link https://www.filestack.com/docs/javascript-api/pick-v3
   * @param  {object} config filestack object
   * @return {Promise} single resolved object
   */
  pick(config?): Promise<any> {
    if (!config) {
      config = {
        maxFiles: 1, // default by max 1 files
        storeTo: {
          location: 's3'
        }
      };
    }

    return this.filestack.pick(config);
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
