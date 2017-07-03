import { Component, Input, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilestackService, FilestackUpload } from '../../shared/filestack/filestack.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'file-question',
  templateUrl: './file.html'
})
export class FileQuestionComponent implements OnInit {
  @Input() question;
  @Input() form: FormGroup;

  uploaded: Array<any> = []; // uploaded files

  constructor(
    private fs: FilestackService,
    private util: UtilsService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    console.log(this.form);
  }

  /**
   * @description Upload file and trigger ngzone to update this.uploaded variable
   */
  upload(event) {
    console.log(event);
    let self = this;

    this.fs.pick({
      maxFiles: 5,
      storeTo: {
        location: 's3'
      }
    }).then((uploaded: FilestackUpload) => {
      self.zone.run(() => {
        uploaded.filesUploaded.forEach((file, index) => {
          file.icon = self.util.getIcon(file.mimetype);
          self.uploaded.push(file);
        });
      });
    });
  }
}
