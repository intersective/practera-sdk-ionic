import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({
  name: 'amDateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | moment.Moment, args: any[]): any {
    return momentConstructor(value).format(args[0]);
  }
}
