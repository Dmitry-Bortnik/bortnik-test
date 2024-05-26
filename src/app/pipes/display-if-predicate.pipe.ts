import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'displayIfPredicate',
})
export class DisplayIfPredicatePipe<T, K> implements PipeTransform {
  transform(value: T, predicate: (value: T, arg1: K) => boolean, arg1: K): boolean {
    return predicate(value, arg1);
  }
}
