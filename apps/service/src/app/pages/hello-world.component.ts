import {
  ButtonComponent,
  CardComponent,
  CardHeaderDirective,
} from '@alauda/ui';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScopedTranslatePipe } from '../translate';
import { WorkspaceHelperService } from '@alauda-fe/common';
import { map } from 'rxjs';

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
  cluster = toSignal(inject(WorkspaceHelperService).baseParams.pipe(map((params) => params.cluster)));

  sayHello() {
    window.alert('Hello, World!');
  }
}
