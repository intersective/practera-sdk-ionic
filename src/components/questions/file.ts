import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilestackService, FilestackUpload } from '../../shared/filestack/filestack.service';

@Component({
  selector: 'file-question',
  templateUrl: './file.html'
})
export class FileQuestionComponent implements OnInit {
  @Input() question;
  @Input() form: FormGroup;

  constructor(
    private fs: FilestackService
  ) {}

  ngOnInit() {
    console.log(this.form);
  }

  /**
   * Upload file feature
   */
  upload(event) {
    console.log(event);
    this.fs.pick({
      maxFiles: 5,
      storeTo1: {
        location: 's3'
      }
    }).then((uploaded: FilestackUpload) => {
      console.log(uploaded);
    }, error => {
      console.log(error);
    });
  }
}
