import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'member',
  templateUrl: 'member.html'
})
export class MemberComponent {
  @Input() member;

  constructor(
    public navCtrl: NavController
  ) {}

  public sendEmail(target) {
    alert('Send email to ' + target);
    // var emails = lodash.map($scope.members, 'email');
    // var link = 'mailto:' + lodash.join(emails, ',');
    // window.location.href = link;
  }
}
