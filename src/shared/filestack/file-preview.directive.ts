import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';
import { WindowRef } from '../window';

@Directive({
  selector: '[filestack-preview]'
})
export class FilestackPreviewDirective implements OnChanges {
  @Input('filestack-preview') url: string;

  /*<div type="filepicker-preview" data-fp-url="https://www.filestackapi.com/api/file/7cSeLSlZSmCk3k8CQtAv" style="width:75%; height:500px"> </div>*/

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private win: WindowRef
  ) {
    el.nativeElement.style.width = '100%';
    el.nativeElement.style.height = win.nativeWindow.screen.height+'px' || '500px';
  }

  ngOnChanges () {
    let el  = this.el.nativeElement;
    let url = this.url || el.getAttribute('filestack-preview');

    if (url && url.length > 0) {
      url = url.replace('api/file/', 'api/preview/');
      let iframe = this.renderer.createElement(el, 'iframe');

      /* Set full size so it gets size from parrent element  */
      iframe.width = '100%';
      iframe.height = '100%';

      iframe.src = url;
    } else {
      el.innerHtml = '<p>Invalid attachment URL found.</p>';
    }
  }
}
