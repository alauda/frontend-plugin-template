import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { InstanceFormComponent } from '../form/component';
import { K8sApiService, KubernetesResource } from '@alauda-fe/common';

@Component({
  templateUrl: 'template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InstanceFormComponent],
})
export class InstanceUpdateComponent implements OnInit {
  private k8sApi = inject(K8sApiService);

  cluster = input.required<string>();
  namespace = input.required<string>();
  resourceNamespace = input.required<string>();
  resourceName = input.required<string>();
  afterSubmitted = input.required<(cr: KubernetesResource) => void>();

  initResource = signal<KubernetesResource>(null);

  ngOnInit(): void {
    this.k8sApi
      .getResource({
        definition: {
          type: 'argocdexports',
          apiGroup: 'argoproj.io',
          apiVersion: 'v1alpha1',
        },
        cluster: this.cluster(),
        namespace: this.resourceNamespace(),
        name: this.resourceName(),
      })
      .subscribe((resource) => {
        this.initResource.set(resource);
      });
  }
}
