import {
  TranslateKey,
  TranslatePipe,
  TranslateService,
} from '@alauda-fe/common';
import { inject, Injectable, Pipe, PipeTransform } from '@angular/core';

import en from './i18n-assets/en.json';
import zh from './i18n-assets/zh.json';

@Injectable({
  providedIn: 'root',
})
export class TranslateScopeService {
  readonly value = '__plugin_i18n_' + new Date().getTime();

  constructor(translate: TranslateService) {
    translate.addTranslations({
      en: { [this.value]: en },
      zh: { [this.value]: zh },
    });
  }
}

@Pipe({
  standalone: true,
  name: 'scopedTranslate',
  pure: false,
})
export class ScopedTranslatePipe
  extends TranslatePipe
  implements PipeTransform
{
  private scope = inject(TranslateScopeService).value;

  override transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: TranslateKey | any,
    data?: unknown,
    ignoreNonExist?: boolean
  ): string {
    return super.transform(this.scope + '.' + key, data, ignoreNonExist);
  }
}
