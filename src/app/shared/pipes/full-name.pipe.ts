import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true,
})
export class FullNamePipe implements PipeTransform {
  transform(value: { first_name?: string | null; last_name?: string | null } | null | undefined): string {
    if (!value) return '';
    const first = value.first_name?.trim() || '';
    const last = value.last_name?.trim() || '';
    return `${first} ${last}`.trim();
  }
}