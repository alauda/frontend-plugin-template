import {
  ButtonComponent,
  CardComponent,
  CardHeaderDirective,
} from '@alauda/ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScopedTranslatePipe } from '@alauda-fe/plugin-sdk/remote';

@Component({
  standalone: true,
  templateUrl: './hello-world.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScopedTranslatePipe,
    CardComponent,
    CardHeaderDirective,
    ButtonComponent,
  ],
})
export class HelloWorldComponent {
  sayHello() {
    window.alert('Hello, World!');
  }
}
