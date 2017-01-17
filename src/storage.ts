import { Injectable } from '@angular/core';

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
 * Next, install the package (comes by default for Ionic 2 apps >= RC.0)
 *
 * ```bash
 * npm install --save @ionic/storage
 * ```
 *
 * Next, add it to the providers list in your `NgModule` declaration (for example, in `src/app.module.ts`):
 *
 * ```typescript
 * import { Storage } from '@ionic/storage';
 *
 * @NgModule({
 *   declarations: [
 *     // ...
 *   ],
 *   imports: [
 *     IonicModule.forRoot(MyApp)
 *   ],
 *   bootstrap: [IonicApp],
 *   entryComponents: [
 *     // ...
 *   ],
 *   providers: [
 *     Storage
 *   ]
 * })
 * export class AppModule {}
 *```
 *
 * Finally, inject it into any of your components or pages:
 * ```typescript
 * import { Storage } from '@ionic/storage';

 * export class MyApp {
 *   constructor(storage: Storage) {
 *
 *      // set a key/value
 *      storage.set('name', 'Max');
 *
 *      // Or to get a key/value pair
 *      storage.get('name').then((val) => {
 *        console.log('Your name is', val);
 *      })
 *   }
 * }
 * ```
 *
 * ### Configuring Storage
 *
 * The Storage engine can be configured both with specific storage engine priorities, or custom configuration
 * options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration
 *
 *
 * ```typescript
 * import { Storage } from '@ionic/storage';
 *
 * export function provideStorage() {
 *   return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' } /* optional config */);
 * }
 *
 * @NgModule({
 *   declarations: ...,
 *   imports: ...,
 *   bootstrap: ...,
 *   entryComponents: ...,
 *    providers: [
 *      { provide: Storage, useFactory: provideStorage }
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
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
  constructor(driverOrder: [string] = ['sqlite', 'indexeddb', 'websql', 'localstorage'], config?: any) {
    this._dbPromise = new Promise((resolve, reject) => {
      let db: LocalForage;

      let dbConfig = {
        name        : '_ionicstorage',
        storeName   : '_ionickv'
      };

      // Merge any custom config options they have
      if(config) {
        for(let k in config) {
          dbConfig[k] = config[k];
        }
      }

      LocalForage.defineDriver(CordovaSQLiteDriver).then(() => {
        db = LocalForage.createInstance(dbConfig);
      })
      .then(() => db.setDriver(this._getDriverOrder(driverOrder)))
      .then(() => {
        this._driver = db.driver();
        resolve(db);
      })
      .catch(reason => reject(reason));
    });
  }

  /**
   * Get the name of the driver being used.
   * @return Name of the driver
   */
  get driver() {
    return this._driver;
  }

  /**
   * Reflect the readiness of the store.
   * @return Promise that resolves when the store is ready
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
   * @param key the key to identify this value
   * @return Promise that resolves with the value
   */
  get(key: string): Promise<any> {
    return this._dbPromise.then(db => db.getItem(key));
  }

  /**
   * Set the value for the given key.
   * @param key the key to identify this value
   * @param value the value for this key
   * @return Promise that resolves when the value is set
   */
  set(key: string, value: any): Promise<any> {
    return this._dbPromise.then(db => db.setItem(key, value));
  }

  /**
   * Remove any value associated with this key.
   * @param key the key to identify this value
   * @return Promise that resolves when the value is removed
   */
  remove(key: string): Promise<any> {
    return this._dbPromise.then(db => db.removeItem(key));
  }

  /**
   * Clear the entire key value store. WARNING: HOT!
   * @return Promise that resolves when the store is cleared
   */
  clear(): Promise<null> {
    return this._dbPromise.then(db => db.clear());
  }

  /**
   * @return Promise that resolves with the number of keys stored.
   */
  length(): Promise<number> {
    return this._dbPromise.then(db => db.length());
  }

  /**
   * @return Promise that resolves with the keys in the store.
   */
  keys(): Promise<string[]> {
    return this._dbPromise.then(db => db.keys());
  }

  /**
   * Iterate through each key,value pair.
   * @param iteratorCallback a callback of the form (value, key, iterationNumber)
   * @return Promise that resolves when the iteration has finished. 
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): Promise<null> {
    return this._dbPromise.then(db => db.iterate(iteratorCallback));
  }
}
