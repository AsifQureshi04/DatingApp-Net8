import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(item: any[], searchText: string): any[] {
    if(!item || !searchText){
      return item
    }
    return  item.filter(item => item.chatPartnerName.toLowerCase().includes(searchText.toLowerCase()));
  }
}
