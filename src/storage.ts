import { Injectable, OpaqueToken, Optional } from '@angular/core';

import LocalForage from 'localforage';

import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';


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
 * cordova plugin add cordova-sqlite-storage --save
 * ```
 *
 * Next, install the package (comes by default for Ionic apps > Ionic V1):
 *
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
 *To make sure the storage system is ready before using, call Storage.ready().
 *
 * ```typescript
 *  storage.ready().then(() => {
 *  });
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
export class Storage {
  private _dbPromise: Promise<LocalForage>;
  private _driver: string = null;

  /**
   * Create a new Storage instance using the order of drivers and any additional config
   * options to pass to LocalForage.
   *
   * Possible driver options are: ['sqlite', 'indexeddb', 'websql', 'localstorage'] and the
   * default is that exact ordering.
   */
  constructor(config: StorageConfig) {
    this._dbPromise = new Promise((resolve, reject) => {
      let db: LocalForage;

      const defaultConfig = getDefaultConfig();
      const actualConfig = Object.assign(defaultConfig, config || {});

      LocalForage.defineDriver(CordovaSQLiteDriver).then(() => {
        db = LocalForage.createInstance(actualConfig);
      })
      .then(() => db.setDriver(this._getDriverOrder(actualConfig.driverOrder)))
      .then(() => {
        this._driver = db.driver();
        resolve(db);
      })
      .catch(reason => reject(reason));
    });
  }

  /**
   * Get the name of the driver being used.
   * @returns {string | null} Name of the driver
   */
  get driver() {
    return this._driver;
  }

  /**
   * Reflect the readiness of the store.
   * @returns {Promise<LocalForage>} Returns a promise that resolves when the store is ready
   */
  ready() {
    return this._dbPromise;
  }

  _getDriverOrder(driverOrder) {
    return driverOrder.map((driver) => {
      switch(driver) {
        case 'sqlite':
          return CordovaSQLiteDriver._driver;
        case 'indexeddb':
          return LocalForage.INDEXEDDB;
        case 'websql':
          return LocalForage.WEBSQL;
        case 'localstorage':
          return LocalForage.LOCALSTORAGE;
      }
    });
  }

  /**
   * Get the value associated with the given key.
   * @param {any} key the key to identify this value
   * @returns {Promise} Returns a promise with the value of the given key
   */
  get(key: string): Promise<any> {
    return this._dbPromise.then(db => db.getItem(key));
  }

  /**
   * Set the value for the given key.
   * @param {any} key the key to identify this value
   * @param {any} value the value for this key
   * @returns {Promise} Returns a promise that resolves when the key and value are set
   */
  set(key: string, value: any): Promise<any> {
    return this._dbPromise.then(db => db.setItem(key, value));
  }

  /**
   * Remove any value associated with this key.
   * @param {any} key the key to identify this value
   * @returns {Promise} Returns a promise that resolves when the value is removed
   */
  remove(key: string): Promise<any> {
    return this._dbPromise.then(db => db.removeItem(key));
  }

  /**
   * Clear the entire key value store. WARNING: HOT!
   * @returns {Promise} Returns a promise that resolves when the store is cleared
   */
  clear(): Promise<void> {
    return this._dbPromise.then(db => db.clear());
  }

  /**
   * @returns {Promise} Returns a promise that resolves with the number of keys stored.
   */
  length(): Promise<number> {
    return this._dbPromise.then(db => db.length());
  }

  /**
   * @returns {Promise} Returns a promise that resolves with the keys in the store.
   */
  keys(): Promise<string[]> {
    return this._dbPromise.then(db => db.keys());
  }

  /**
   * Iterate through each key,value pair.
   * @param {any} iteratorCallback a callback of the form (value, key, iterationNumber)
   * @returns {Promise} Returns a promise that resolves when the iteration has finished.
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): Promise<void> {
    return this._dbPromise.then(db => db.iterate(iteratorCallback));
  }
}

/** @hidden */
export function getDefaultConfig() {
  return {
    name        : '_ionicstorage',
    storeName   : '_ionickv',
    driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
  };
}

/** @hidden */
export interface StorageConfig {
    name?: string;
    storeName?: string;
    driverOrder?: string[];
};

/** @hidden */
export const StorageConfigToken = new OpaqueToken('STORAGE_CONFIG_TOKEN');

/** @hidden */
export function provideStorage(storageConfig: StorageConfig): Storage {
  const config = !!storageConfig ? storageConfig : getDefaultConfig();
  return new Storage(config);
}

