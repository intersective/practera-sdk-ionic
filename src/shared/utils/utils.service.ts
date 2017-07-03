import { Injectable } from '@angular/core';

const zipMime = [
  'application/x-compressed',
  'application/x-zip-compressed',
  'application/zip',
  'multipart/x-zip',
];

@Injectable()
export class UtilsService {

  getIcon(mimetype: string) {
    let result: string = '';

    if (zipMime.indexOf(mimetype) >= 0) {
      result = 'fa-zip';

    // set icon to different document type (excel, word, powerpoint, audio, video)
    } else if (mimetype.indexOf('audio/') >= 0) {
      result = 'fa-sound';
    } else if (mimetype.indexOf('image/') >= 0) {
      result = 'fa-image';
    } else if (mimetype.indexOf('text/') >= 0) {
      result = 'fa-text';
    } else if (mimetype.indexOf('video/') >= 0) {
      result = 'fa-movie';
    } else {
      switch (mimetype) {
        case 'application/pdf':
          result = 'fa-pdf';
          break;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          result = 'fa-word';
          break;
        case 'application/excel':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/x-excel':
        case 'application/x-msexcel':
          result = 'fa-excel';
          break;
        case 'application/mspowerpoint':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/x-mspowerpoint':
          result = 'fa-powerpoint';
          break;
        default:
          result = 'fa-file';
          break;
      }
    }

    return result;
  }

  isCompressed(type: string) {
    if (zipMime.indexOf(type) >= 0) {
      return true;
    }
    return false;
  }
}
