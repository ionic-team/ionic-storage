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
  _db: any;

  constructor() {
    this._db = LocalForage;

    this._db.config({
      name        : '_ionicstorage',
      storeName   : '_ionickv'
    });
    this._db.defineDriver(CordovaSQLiteDriver).then(() => this._db.setDriver([
      CordovaSQLiteDriver._driver,
      this._db.INDEXEDDB,
      this._db.WEBSQL,
      this._db.LOCALSTORAGE
    ])).then(() => {
      console.info('Ionic Storage driver:', this._db.driver());
    });
  }

  /**
   * Get the value assocated with the given key.
   * @return Promise that resolves with the value
   */
  get(key: string): Promise<any> {
    return this._db.getItem(key);
  }

  /**
   * Set the value for the given key.
   * @param key the key to identify this value
   * @param value the value for this key
   * @return Promise that resolves when the value is set
   */
  set(key: string, value: any) {
    return this._db.setItem(key, value);
  }

  /**
   * Remove any value associated with this key.
   * @param key the key to identify this value
   * @return Promise that resolves when the value is removed
   */
  remove(key: string) {
    return this._db.removeItem(key);
  }

  /**
   * Clear the entire key value store. WARNING: HOT!
   * @return Promise that resolves when the kv store is cleared
   */
  clear() {
    return this._db.clear();
  }

  /**
   * @return the number of keys stored.
   */
  length() {
    return this._db.length();
  }

  /**
   * @return the keys in the store.
   */
  keys() {
    return this._db.keys();
  }

  /**
   * Iterate through each key,value pair.
   * @param iteratorCallback a callback of the form (value, key, iterationNumber)
   */
  forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any) {
    return this._db.iterate(iteratorCallback);
  }

  /**
   * Set storage engine
   * @param engine engine allows you to specify a specific storage engine to use.
   */
  setDriver(engine: string) {
    this._db.setDriver(engine);
  }

}
