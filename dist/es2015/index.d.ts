import { ModuleWithProviders } from '@angular/core';
import { Storage, StorageConfig, StorageConfigToken } from './storage';
export { StorageConfig, StorageConfigToken, Storage };
export declare class IonicStorageModule {
    static forRoot(storageConfig?: StorageConfig): ModuleWithProviders;
}
