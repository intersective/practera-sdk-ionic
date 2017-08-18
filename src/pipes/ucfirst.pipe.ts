import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ucfirst'
})
// replication of PHP native ucfirst()
export class UcfirstPipe implements PipeTransform {
  transform(input: string): any {
    let result = '';

    // turn first letter of word into upper case
    var capitalizeFirstLetter = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (input) {
      result = capitalizeFirstLetter(input);
    }

    return result;
  }
}

