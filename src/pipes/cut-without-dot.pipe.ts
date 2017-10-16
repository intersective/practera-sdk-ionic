import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'cutText'
})
export class CutWithoutDotPipe implements PipeTransform {
  transform(value: string, str: string[]): string {
    let limitLength = str.length > 0 ? parseInt(str[0], str.length) : 50;
    let result = str.length > 1 ? str[1] : ' ';
    return value.length > limitLength ? value.substring(0, limitLength) + result : value;
  }
}
