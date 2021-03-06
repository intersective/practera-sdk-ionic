import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';
import { WindowRef } from '../window';

@Directive({
  selector: '[file-preview]'
})
export class FilePreviewDirective implements OnChanges {
  @Input('file-preview') url: string;

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
    let url = this.url || el.getAttribute('file-preview');

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
