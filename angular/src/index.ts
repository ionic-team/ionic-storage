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


function getNoopDriver() {
  // noop driver for ssr environment
  const noop = () => { };
  const driver: any = {
    getItem: noop,
    setItem: noop,
    removeItem: noop,
    clear: noop,
    length: () => 0,
    keys: () => [],
    iterate: noop,
  };
  return driver;
}

export function provideStorage(
  storageConfig: StorageConfig
): Storage {
  /*
  if (isPlatformServer(this.platformId)) {
    const noopDriver = getNoopDriver();
    return noopDriver;
  }
  */

  return new Storage(storageConfig);
}


/**
 * Storage is an easy way to store key/value pairs and JSON objects.
 * Storage uses a variety of storage engines underneath, picking the best one available
 * depending on the platform.
 *
 * When running in a native app context, Storage will prioritize using SQLite, as it's one of
 * the most stable and widely used file-based databases, and avoids some of the
 * pitfalls of things like localstorage and IndexedDB, such as the OS deciding to clear out such
 * data in low disk-space situations.
 *
 * When running in the web or as a Progressive Web App, Storage will attempt to use
 * IndexedDB, WebSQL, and localstorage, in that order.
 *
 * @usage
 * First, if you'd like to use SQLite, install the cordova-sqlite-storage plugin:
 * ```bash
 * ionic cordova plugin add cordova-sqlite-storage
 * ```
 *
 * Next, install the package (comes by default for Ionic apps > Ionic V1):
 * ```bash
 * npm install --save @ionic/storage
 * ```
 *
 * Next, add it to the imports list in your `NgModule` declaration (for example, in `src/app/app.module.ts`):
 *
 * ```typescript
 * import { IonicStorageModule } from '@ionic/storage';
 *
 * @NgModule({
 *   declarations: [
 *     // ...
 *   ],
 *   imports: [
 *     BrowserModule,
 *     IonicModule.forRoot(MyApp),
 *     IonicStorageModule.forRoot()
 *   ],
 *   bootstrap: [IonicApp],
 *   entryComponents: [
 *     // ...
 *   ],
 *   providers: [
 *     // ...
 *   ]
 * })
 * export class AppModule {}
 *```
 *
 * Finally, inject it into any of your components or pages:
 * ```typescript
 * import { Storage } from '@ionic/storage';

 * export class MyApp {
 *   constructor(private storage: Storage) { }
 *
 *   ...
 *
 *   // set a key/value
 *   storage.set('name', 'Max');
 *
 *   // Or to get a key/value pair
 *   storage.get('age').then((val) => {
 *     console.log('Your age is', val);
 *   });
 * }
 * ```
 *
 *
 * ### Configuring Storage
 *
 * The Storage engine can be configured both with specific storage engine priorities, or custom configuration
 * options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration
 *
 * Note: Any custom configurations will be merged with the default configuration
 *
 * ```typescript
 * import { IonicStorageModule } from '@ionic/storage';
 *
 * @NgModule({
 *   declarations: [...],
 *   imports: [
 *     IonicStorageModule.forRoot({
 *       name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
 *     })
 *   ],
 *   bootstrap: [...],
 *   entryComponents: [...],
 *    providers: [...]
 * })
 * export class AppModule { }
 * ```
 */
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
