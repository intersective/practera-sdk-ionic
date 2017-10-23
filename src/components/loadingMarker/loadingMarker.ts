import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-marker',
  templateUrl: 'loadingMarker.html'
})
export class LoadingMarkerComponent {
  @Input() loading: any;
}
