import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './base-link.html',
  styleUrl: './base-link.scss',
  selector: 'base-link',
  imports: [RouterLink],
})
export class BaseLink {
  external = input<boolean>(false);
  to = input<string>('');
}
