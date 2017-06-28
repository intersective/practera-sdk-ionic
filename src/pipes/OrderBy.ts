import {Pipe, PipeTransform} from '@angular/core';
declare var _: any;

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(input: any[], ...args: any[] ) : any {
    return _.orderBy(input, args[0], args[1]);
  }
}
