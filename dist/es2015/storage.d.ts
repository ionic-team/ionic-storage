/// <reference types="localforage" />
import { OpaqueToken } from '@angular/core';
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
export declare class Storage {
    private _dbPromise;
    private _driver;
    /**
     * Create a new Storage instance using the order of drivers and any additional config
     * options to pass to LocalForage.
     *
     * Possible driver options are: ['sqlite', 'indexeddb', 'websql', 'localstorage'] and the
     * default is that exact ordering.
     */
    constructor(config: StorageConfig);
    /**
     * Get the name of the driver being used.
     * @returns {string | null} Name of the driver
     */
    readonly driver: string;
    /**
     * Reflect the readiness of the store.
     * @returns {Promise<LocalForage>} Returns a promise that resolves when the store is ready
     */
    ready(): Promise<LocalForage>;
    _getDriverOrder(driverOrder: any): any;
    /**
     * Get the value associated with the given key.
     * @param {any} key the key to identify this value
     * @returns {Promise} Returns a promise with the value of the given key
     */
    get(key: string): Promise<any>;
    /**
     * Set the value for the given key.
     * @param {any} key the key to identify this value
     * @param {any} value the value for this key
     * @returns {Promise} Returns a promise that resolves when the key and value are set
     */
    set(key: string, value: any): Promise<any>;
    /**
     * Remove any value associated with this key.
     * @param {any} key the key to identify this value
     * @returns {Promise} Returns a promise that resolves when the value is removed
     */
    remove(key: string): Promise<any>;
    /**
     * Clear the entire key value store. WARNING: HOT!
     * @returns {Promise} Returns a promise that resolves when the store is cleared
     */
    clear(): Promise<void>;
    /**
     * @returns {Promise} Returns a promise that resolves with the number of keys stored.
     */
    length(): Promise<number>;
    /**
     * @returns {Promise} Returns a promise that resolves with the keys in the store.
     */
    keys(): Promise<string[]>;
    /**
     * Iterate through each key,value pair.
     * @param {any} iteratorCallback a callback of the form (value, key, iterationNumber)
     * @returns {Promise} Returns a promise that resolves when the iteration has finished.
     */
    forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): Promise<void>;
    /**
     * Create new db instance
     * @param name instance name to be created
     */
    createInstance(name: string): Promise<LocalForage>;
}
/** @hidden */
export declare function getDefaultConfig(): {
    name: string;
    storeName: string;
    driverOrder: string[];
};
/** @hidden */
export interface StorageConfig {
    name?: string;
    storeName?: string;
    driverOrder?: string[];
}
/** @hidden */
export declare const StorageConfigToken: OpaqueToken;
/** @hidden */
export declare function provideStorage(storageConfig: StorageConfig): Storage;
