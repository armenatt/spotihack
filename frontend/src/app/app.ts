import { Component, signal } from '@angular/core';
import { BaseButton } from './components/base-button/base-button';
import { BaseIcon } from '@/app/components/base-icon/base-icon';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { BaseInput } from './components/base-input/base-input';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    AngularSvgIconModule,
    HttpClientModule,
    BaseButton,
    BaseIcon,
    BaseInput,
  ],
})
export class App {
  protected readonly title = signal('frontend');
}
