import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormatter',
  standalone: true
})
export class DateTimeFormatterPipe implements PipeTransform {

  transform(value: string | Date): string {
    const inputDate = new Date(value);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate()-1)
    const isToday = inputDate.toDateString() === today.toDateString();
    const isYesterday = inputDate.toDateString() === yesterday.toDateString();
    if(isToday){
      return inputDate.toLocaleTimeString([],{hour:'2-digit',minute:"2-digit"});
    }else if(isYesterday){
      return 'Yesterday';
    }else{
      return inputDate.toLocaleDateString([],{month:'short',day:'numeric'});
    }
  }

}
