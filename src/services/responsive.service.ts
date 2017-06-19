import { Injectable, NgZone } from '@angular/core';
@Injectable()
export class ResponsiveService {
  private windowHeight: number = window.innerHeight / 3;
  private isLandscaped: boolean = false;
  constructor(private ngZone: NgZone){}
  public gcd (v1, v2) {
    return (v2 == 0) ? v1 : this.gcd(v2, v1%v2);
  }
  initialScreenSetup(){
    const screnWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const ratio = this.gcd(screnWidth, screenHeight);
    const ratioValue = screnWidth/ratio + ":" + screenHeight/ratio;
    const ratioRate = (screnWidth/ratio)/(screenHeight/ratio);
    return ratioRate;
  }
  getInitialScreen(){
    return (this.isDisabled()) ? this.isLandscaped = true : this.isLandscaped = false;
  }
  isMobileDevice(){
    return navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("Android") || navigator.userAgent.includes("Windows Phone");
  }
  isDisabled(){
    return (this.initialScreenSetup() > 1.2 && window.innerWidth < 1024);
  }
}
