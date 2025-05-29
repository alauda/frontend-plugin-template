import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  ButtonComponent,
  CardModule,
  FormModule,
  InputComponent,
} from '@alauda/ui';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ErrorsMapperComponent,
  InterceptDeactivateDirective,
  K8sApiService,
  KubernetesResource,
  TranslatePipe,
} from '@alauda-fe/common';

@Component({
  selector: 'app-instance-form',
  templateUrl: 'template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslatePipe,
    FormsModule,
    FormModule,
    CardModule,
    ButtonComponent,
    InputComponent,
    ErrorsMapperComponent,
    InterceptDeactivateDirective,
  ],
})
export class InstanceFormComponent implements OnInit {
  private k8sApi = inject(K8sApiService);
  private ngForm = viewChild(NgForm);

  action = input<'update' | 'create'>('create');
  cluster = input.required<string>();
  initResource = input.required<KubernetesResource>();

  afterSubmitted = output<KubernetesResource>();

  submitting = signal(false);

  model: any;

  ngOnInit() {
    this.model = this.initResource();
  }

  submit() {
    this.ngForm().onSubmit(null);
    if (!this.ngForm().valid) {
      return;
    }

    this.submitting.set(true);

    (this.action() === 'update'
      ? this.k8sApi.putResource
      : this.k8sApi.postResource
    )
      .bind(this.k8sApi)({
        definition: {
          type: 'argocdexports',
          apiGroup: 'argoproj.io',
          apiVersion: 'v1alpha1',
        },
        cluster: this.cluster(),
        resource: this.model,
      })
      .subscribe({
        next: (resource) => {
          this.submitting.set(false);
          this.afterSubmitted.emit(resource);
        },
        complete: () => {
          this.submitting.set(false);
        },
      });
  }
}
