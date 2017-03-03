import { NgModule, ModuleWithProviders } from '@angular/core';

import { getDefaultConfig, provideStorage, Storage, StorageConfig, StorageConfigToken } from './storage';

export { Storage, StorageConfig, StorageConfigToken };

@NgModule({
})
export class IonicStorageModule {
  static forRoot(storageConfig: StorageConfig = null): ModuleWithProviders {
    return {
      ngModule: IonicStorageModule,
      providers: [
        { provide: StorageConfigToken, useValue: storageConfig },
        { provide: Storage, useFactory: provideStorage, deps: [StorageConfigToken]},
      ]
    }
  }
}
