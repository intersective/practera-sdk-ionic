import { Injectable, Optional } from '@angular/core';
import { PiwikConfig } from './piwik.config';

declare var _paq: any;
declare var Piwik: any;

export class FilestackUpload {
  filesFailed: Array<any>;
  filesUploaded: Array<any>;
}

export class PiwikService {
  private piwik: any;
  private tracker: any;
  version: any;

  constructor(@Optional() config: PiwikConfig) {
    try {
      this.piwik = Piwik;
      this.tracker = this.piwik.getTracker(config.trackerUrl, config.sid);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * display pick/upload popup for file upload,
   * refer to filestack documentation for more config information
   * @link https://www.filestack.com/docs/javascript-api/pick-v3
   * @param  {object} config filestack object
   * @return {Promise} single resolved object
   */
  pick(config?): Promise<any> {
    return this.piwik.pick(config);
  }
}
