import { NgModule, ModuleWithProviders } from '@angular/core';

import { getDefaultConfig, provideStorage, Storage, StorageConfig, StorageConfigToken } from './storage';

export { StorageConfig, StorageConfigToken, Storage };

@NgModule({
})
export class IonicStorageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicStorageModule,
      providers: [
        { provide: Storage, useFactory: getDefaultConfig, deps: [StorageConfigToken] }
      ]
    }
  }
}
