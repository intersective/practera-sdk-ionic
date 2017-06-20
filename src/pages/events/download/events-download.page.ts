import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FilestackService } from '../../../shared/filestack/filestack.service';
import { EventsPreviewPage } from './events-preview.page';

import { WindowRef } from '../../../shared/window';

@Component({
  templateUrl: './events-download.html'
})
export class EventsDownloadPage {
  event: any = {};
  files: any = [];

  constructor(
    private navCtrl: NavController,
    private params: NavParams,
    private fs: FilestackService,
    private win: WindowRef
  ) {
  }

  ionViewDidEnter() {
    this.event = this.params.get('event');
    console.log(this.event);
    console.log(this.fs.version);

    this.files = [];

    if (this.event && this.event.files) {
      this.files = this.event.files;
    }

    this.files.map(file => {
      // zip file type is not viewable in filestack preview
      if ([
        'application/x-compressed',
        'application/x-zip-compressed',
        'application/zip',
        'multipart/x-zip',
      ].indexOf(file.type) >= 0) {
        file.icon = 'fa-zip';

      // set icon to different document type (excel, word, powerpoint, audio, video)
      } else if (file.type.indexOf('audio/') >= 0) {
        file.icon = 'fa-sound';
      } else if (file.type.indexOf('image/') >= 0) {
        file.icon = 'fa-image';
      } else if (file.type.indexOf('text/') >= 0) {
        file.icon = 'fa-text';
      } else if (file.type.indexOf('video/') >= 0) {
        file.icon = 'fa-movie';
      } else {
        switch (file.type) {
          case 'application/pdf':
            file.icon = 'fa-pdf';
            break;
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            file.icon = 'fa-word';
            break;
          case 'application/excel':
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          case 'application/x-excel':
          case 'application/x-msexcel':
            file.icon = 'fa-excel';
            break;
          case 'application/mspowerpoint':
          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          case 'application/x-mspowerpoint':
            file.icon = 'fa-powerpoint';
            break;
          default:
            file.icon = 'fa-file';
            break;
        }
      }
    });
  }

  /**
   * preview file with filestack plugin
   * if it is a zip filetype, download the file instead.
   *
   * @param {object} file single file from files array return from get_events in event list page
   */
  view(file) {
    if ([
      'application/x-compressed',
      'application/x-zip-compressed',
      'application/zip',
      'multipart/x-zip',
    ].indexOf(file.type) >= 0) {
      let win = this.win.nativeWindow;
      let openedWindow = win.open(file.url, '_blank');
    } else {
      this.navCtrl.push(EventsPreviewPage, {file: file});
    }
  }

  /**
   * @TODO: move to some where it's necessary
   * @description temporary/development purpose file picker for file upload
   */
  pick() {
    /*{
      "handle": "vM9Vi9FTVi7VsDRJclR3",
      "url": "https://cdn.filestackcontent.com/vM9Vi9FTVi7VsDRJclR3",
      "filename": "Image uploaded from iOS.jpg",
      "size": 1701895,
      "mimetype": "image/jpeg",
      "status": "Stored"
    }*/

    this.fs.pick({
      accept: 'image/*',
      maxFiles: 5,
      storeTo: {
        location: 's3'
      }
    }).then(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
}
