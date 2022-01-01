import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string): any {
    if (filterString === '') return value;

    const lowercased = filterString.toLowerCase();
    const uppercased = filterString.toUpperCase();
    const titlecased =
      filterString.charAt(0).toUpperCase() + filterString.substr(1);

    const resultArray = [];

    for (const item of value) {
      if (
        item[propName].match(lowercased) ||
        item[propName].match(uppercased) ||
        item[propName].match(titlecased)
      ) {
        resultArray.push(item);
      }
    }

    return resultArray;
  }
}
