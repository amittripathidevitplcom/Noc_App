import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearchFilter'
})
export class TableSearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter(function (item: any) {
      return JSON.stringify(item) 
        .toLowerCase()
        .includes(args);
    });
  }
}
