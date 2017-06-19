import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import * as _ from 'lodash';
import * as moment from 'moment';

import { AssessmentService } from '../../services/assessment.service';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'gallery-page',
  templateUrl: 'gallery.html'
})
export class GalleryPage {
  avatarName: any;
  avatarPhoto: any;

  photos: any[];
  assessments: any;
  name: string;

  _mock = {
    avatar: {
      name: 'Jose',
      photo: 'https://unsplash.it/100/100'
    },
    photos: [
      {
        name: 'Test 1',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 2',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 3',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 4',
        photo: 'https://unsplash.it/50/50'
      }
    ]
  }

  private refresher = null;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public assessmentService: AssessmentService,
    public submissionService: SubmissionService
  ) {}

  // @TODO: Move to shared function later...
  private _error(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  private _pullData() {
    this.assessmentService.getAssessments()
    .then((result) => {
      this.assessments = result;
      return this.submissionService.getSubmissions();
    })
    .then((result) => {
      let extractedPhotos = this.submissionService.extractPhotos(result);

      if (this.assessments.success || _.isArray(extractedPhotos)) {
        _.forEach(this.assessments.data, (assessment) => {
          if (assessment.Assessment.assessment_type === 'checkin') {
            let foundPhoto = _.find(extractedPhotos, function(p) {
              return p.assessment_id == assessment.Assessment.id;
            });

            if (foundPhoto) {
              this.photos.push({
                name: assessment.Assessment.name,
                photo: foundPhoto.photo,
                submitted: moment.utc(foundPhoto.submitted).local().format("D-M-YYYY, hA")
              });
            }
          }
        });

        this.photos = _.sortBy(this.photos, 'submitted');
      }

      if (this.refresher) {
        this.refresher.complete();
      }
    })
    .catch((err) => {
      if (this.refresher) {
        this.refresher.complete();
      }
      this._error(err)
    });
  }

  public doRefresh(refresher) {
    this.refresher = refresher;
    this._pullData();

    // @TODO Remove it later...
    this.avatarName = this._mock.avatar.name;
    this.avatarPhoto = this._mock.avatar.photo;
  }

  ionViewWillEnter() {
    // @TODO We should not block user if no linkedin photo...

    this._pullData();

    // @TODO Remove it later...
    this.avatarName = this._mock.avatar.name;
    this.avatarPhoto = this._mock.avatar.photo;
    this.photos = [
      {
        name: 'Test 1',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 2',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 3',
        photo: 'https://unsplash.it/50/50'
      },
      {
        name: 'Test 4',
        photo: 'https://unsplash.it/50/50'
      }
    ];
    console.log('this.photos', this.photos)
  }


}
