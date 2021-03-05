import { NgModule, ModuleWithProviders, PLATFORM_ID } from '@angular/core';
import {
  provideStorage,
  Storage,
  StorageConfigToken
} from './storage';

import {
  getDefaultConfig,
  StorageConfig
} from '@ionic/storage';

export { StorageConfig, StorageConfigToken, Storage };

@NgModule()
export class IonicStorageModule {
  static forRoot(storageConfig: StorageConfig = null): ModuleWithProviders<IonicStorageModule> {
    return {
      ngModule: IonicStorageModule,
      providers: [
        { provide: StorageConfigToken, useValue: storageConfig },
        {
          provide: Storage,
          useFactory: provideStorage,
          deps: [StorageConfigToken, PLATFORM_ID]
        }
      ]
    };
  }
}
