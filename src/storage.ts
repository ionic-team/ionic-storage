import { Injectable } from '@angular/core';

//import LocalForage = require('localforage');
//import * as LocalForage from 'localforage';
import * as LocalForage from 'localforage';

//declare var LocalForage;

import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

//console.log('Loaded CordovaSQLiteDriver', CordovaSQLiteDriver);


/**
 * Storage is an easy way to store key/value pairs and other complicated
 * data in a way that uses a variety of storage engines underneath. Currently,
 * Storage uses localforage underneath to abstract away the various storage
 * engines while still providing a simple API.
 *
 * When running natively, Storage will prioritize using SQLite, as it's one of
 * the most stable and widely used file-based databases, and avoids some of the
 * pitfalls of things like localstorage that the OS can decide to clear out in
 * low disk-space situations.
 *
 * When running in the web or as a Progressive Web App, Storage will attempt to use
 * IndexedDB, WebSQL, and localstorage, in that order.
 */
@Injectable()
export class Storage {
  _db: any;

  constructor() {
    // TODO: Remove this once we figure out our proper build
    if(LocalForage['default']) {
      this._db = LocalForage['default'];
    } else {
      this._db = LocalForage;
    }

    this._db.config({
      name        : '_ionicstorage',
      storeName   : '_ionickv'
    });

    var sqliteDriver = CordovaSQLiteDriver['default'];

    this._db.setDriver([
      //ggsqliteDriver._driver,
      this._db.INDEXEDDB,
      this._db.WEBSQL,
      this._db.LOCALSTORAGE
    ])
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
    this._db.setDriver(this._db.engine);
  }

}
