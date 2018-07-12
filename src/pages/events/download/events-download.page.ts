import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Pages
import { EventsPreviewPage } from './events-preview.page';
// Others
import { FilepickerService } from '../../../shared/filepicker/filepicker.service';
import { UtilsService } from '../../../shared/utils/utils.service';
import { WindowRef } from '../../../shared/window';

@Component({
  templateUrl: './events-download.html'
})
export class EventsDownloadPage {
  event: any = {};
  files: any = [];

  constructor(
    public fs: FilepickerService,
    public navCtrl: NavController,
    public params: NavParams,
    public win: WindowRef,
    public utils: UtilsService
  ) {}

  ionViewDidEnter() {
    this.event = this.params.get('event');
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
