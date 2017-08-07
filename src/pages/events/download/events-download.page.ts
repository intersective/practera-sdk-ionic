import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FilestackService } from '../../../shared/filestack/filestack.service';
import { EventsPreviewPage } from './events-preview.page';
import { UtilsService } from '../../../shared/utils/utils.service';
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
    private win: WindowRef,
    private utils: UtilsService
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
      file.icon = this.utils.getIcon(file.type)
    });
  }

  /**
   * preview file with filestack plugin
   * if it is a zip filetype, download the file instead.
   *
   * @param {object} file single file from files array return from get_events in event list page
   */
  view(file) {
    if (this.utils.isCompressed(file.type)) {
      let win = this.win.nativeWindow;
      let openedWindow = win.open(file.url, '_blank');
    } else {
      this.navCtrl.push(EventsPreviewPage, {file: file});
    }
  }
}
