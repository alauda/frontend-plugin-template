import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { InstanceFormComponent } from '../form/component';
import { KubernetesResource } from '@alauda-fe/common';

@Component({
  templateUrl: 'template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InstanceFormComponent],
})
export class InstanceCreateComponent implements OnInit {
  cluster = input.required<string>();
  namespace = input.required<string>();
  afterSubmitted = input.required<(cr: KubernetesResource) => void>();

  initResource: KubernetesResource;

  ngOnInit(): void {
    this.initResource = {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'ArgoCDExport',
      metadata: { name: 'argocdexport-sample', namespace: this.namespace() },
      spec: { argocd: 'argocd-sample' },
    };
  }
}
