import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[card-image-height]'
})

export class CardHeightDirective {
  constructor(el: ElementRef){
    el.nativeElement.style.height = '140px';
    // el.nativeElement.style.backgroundColor = "gray";
    console.log("Height: ", el.nativeElement.style.height);
  }
}