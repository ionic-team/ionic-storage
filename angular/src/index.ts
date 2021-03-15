import { NgModule, ModuleWithProviders, PLATFORM_ID, InjectionToken } from '@angular/core';

import {
  Storage,
  StorageConfig
} from '@ionic/storage';
import { isPlatformServer } from '@angular/common';

const StorageConfigToken = new InjectionToken<any>(
  'STORAGE_CONFIG_TOKEN'
);

export { StorageConfig, StorageConfigToken, Storage };

class NoopStorage extends Storage {
  constructor() {
    super();
  }
  async create() {
    return this;
  }
  async defineDriver() {
  }
  get driver(): string | null {
    return 'noop';
  }
  async get(key: string) { return null; }
  async set(key: string, value: any) { }
  async remove(key: string): Promise<any> { }
  async clear(): Promise<void> { }
  async length(): Promise<number> { return 0; }
  async keys() { return [] }
  async forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): Promise<void> { }
  setEncryptionKey(key: string) { }
}

export function provideStorage(
  storageConfig: StorageConfig
): Storage {
  if (isPlatformServer(this.platformId)) {
    // When running in a server context return the NoopStorage
    return new NoopStorage();
  }

  return new Storage(storageConfig);
}

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
          deps: [StorageConfigToken]
        }
      ]
    };
  }
}
