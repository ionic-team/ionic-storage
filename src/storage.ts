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
  import { Storage } from '@ionic/storage';

  @NgModule({
    declarations: [
      // ...
    ],
    imports: [
      IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
      // ...
    ],
    providers: [
      Storage
    ]
  })
  export class AppModule {}
 *```
 *
 * Finally, inject it into any of your components or pages:
 * ```typescript
 * import { Storage } from '@ionic/storage';

 * export class MyApp {
 *   constructor(storage: Storage) {
 *      storage.set('name', 'Max');
 *      storage.get('name').then((val) => {
 *        console.log('Your name is', val);
 *      })
 *   }
 * }
 * ```
 */
@Injectable()
export class Storage {
  private _dbPromise: Promise<LocalForage>;

  constructor() {
    this._dbPromise = new Promise((resolve, reject) => {
      let db: LocalForage;
      LocalForage.defineDriver(CordovaSQLiteDriver).then(() => {
        db = LocalForage.createInstance({
          name        : '_ionicstorage',
          storeName   : '_ionickv'
        })
      }).then(() => db.setDriver([
        CordovaSQLiteDriver._driver,
        LocalForage.INDEXEDDB,
        LocalForage.WEBSQL,
        LocalForage.LOCALSTORAGE
      ])).then(() => {
        console.info('Ionic Storage driver:', LocalForage.driver());
        resolve(db);
      }).catch(reason => reject(reason));
    });
  }

  /**
   * Get the value assocated with the given key.
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
  set(key: string, value: any) {
    return this._dbPromise.then(db => db.setItem(key, value));
  }

  /**
   * Remove any value associated with this key.
   * @param key the key to identify this value
   * @return Promise that resolves when the value is removed
   */
  remove(key: string) {
    return this._dbPromise.then(db => db.removeItem(key));
  }

  /**
   * Clear the entire key value store. WARNING: HOT!
   * @return Promise that resolves when the kv store is cleared
   */
  clear() {
    return this._dbPromise.then(db => db.clear());
  }

  /**
   * @return the number of keys stored.
   */
  length() {
    return this._dbPromise.then(db => db.length());
  }

  /**
   * @return the keys in the store.
   */
  keys() {
    return this._dbPromise.then(db => db.keys());
  }

  /**
   * Iterate through each key,value pair.
   * @param iteratorCallback a callback of the form (value, key, iterationNumber)
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any) {
    return this._dbPromise.then(db => db.iterate(iteratorCallback));
  }

}
