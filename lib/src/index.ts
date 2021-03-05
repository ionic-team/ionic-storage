import LocalForage from 'localforage';

const defaultConfig = {
  name: '_ionicstorage',
  storeName: '_ionickv',
  dbKey: '_ionickey',
  driverOrder: ['indexeddb', 'websql', 'localstorage'],
};

export type Database = LocalForage;

export class Storage {
  private _driver: string | null = null;
  private _config: StorageConfig;
  private _db: Database | null = null;

  /**
   * Create a new Storage instance using the order of drivers and any additional config
   * options to pass to LocalForage.
   *
   * Possible driver options are: ['sqlite', 'indexeddb', 'websql', 'localstorage'] and the
   * default is that exact ordering.
   */
  constructor(config: StorageConfig = defaultConfig) {
    const actualConfig = Object.assign(defaultConfig, config || {});
    this._config = actualConfig;
  }

  async create(): Promise<Database> {
    const db = LocalForage.createInstance(this._config);
    this._db = db;
    await db.setDriver(this._getDriverOrder(this._config.driverOrder));
    return db;
    /*
      let db: LocalForage;

      const defaultConfig = getDefaultConfig();
      const actualConfig = Object.assign(defaultConfig, config || {});

      LocalForage.defineDriver(CordovaSQLiteDriver)
        .then(() => {
          db = LocalForage.createInstance(actualConfig);
        })
        .then(() =>
          db.setDriver(this._getDriverOrder(actualConfig.driverOrder))
        )
        .then(() => {
          this._driver = db.driver();
          resolve(db);
        })
        .catch((reason) => reject(reason));
    });
    */
  }

  /**
   * Define a new LocalForageDriver. Must be called before
   * initializing the database. Example:
   * 
   * await storage.defineDriver(myDriver);
   * await storage.create();
   */
  async defineDriver(driver: LocalForageDriver) {
    return LocalForage.defineDriver(driver);
  }

  /**
   * Get the name of the driver being used.
   * @returns Name of the driver
   */
  get driver(): string | null {
    return this._driver;
  }

  /** @hidden */
  private _getDriverOrder(driverOrder: string[] = []): string[] {
    return driverOrder.map((driver: string) => {
      switch (driver) {
        case 'indexeddb':
          return LocalForage.INDEXEDDB;
        case 'websql':
          return LocalForage.WEBSQL;
        case 'localstorage':
          return LocalForage.LOCALSTORAGE;
      }
    }).filter(d => !!d) as string[];
  }

  private assertDb(): Database {
    if (!this._db) {
      throw new Error('Database not created. Must call create() first');
    }

    return this._db!;
  }

  /**
   * Get the value associated with the given key.
   * @param key the key to identify this value
   * @returns Returns a promise with the value of the given key
   */
  get(key: string): Promise<any> {
    this.assertDb();
    return this._db!.getItem(key);
  }

  /**
   * Set the value for the given key.
   * @param key the key to identify this value
   * @param value the value for this key
   * @returns Returns a promise that resolves when the key and value are set
   */
  set(key: string, value: any): Promise<any> {
    const db = this.assertDb();
    return db.setItem(key, value);
  }

  /**
   * Remove any value associated with this key.
   * @param key the key to identify this value
   * @returns Returns a promise that resolves when the value is removed
   */
  remove(key: string): Promise<any> {
    const db = this.assertDb();
    return db.removeItem(key);
  }

  /**
   * Clear the entire key value store. WARNING: HOT!
   * @returns Returns a promise that resolves when the store is cleared
   */
  clear(): Promise<void> {
    const db = this.assertDb();
    return db.clear();
  }

  /**
   * @returns Returns a promise that resolves with the number of keys stored.
   */
  length(): Promise<number> {
    const db = this.assertDb();
    return db.length();
  }

  /**
   * @returns Returns a promise that resolves with the keys in the store.
   */
  keys(): Promise<string[]> {
    const db = this.assertDb();
    return db.keys();
  }

  /**
   * Iterate through each key,value pair.
   * @param iteratorCallback a callback of the form (value, key, iterationNumber)
   * @returns Returns a promise that resolves when the iteration has finished.
   */
  forEach(
    iteratorCallback: (value: any, key: string, iterationNumber: Number) => any
  ): Promise<void> {
    const db = this.assertDb();
    return db.iterate(iteratorCallback);
  }
}

/** @hidden */
export function getDefaultConfig() {
}

/** @hidden */
export interface StorageConfig {
  name?: string;
  version?: number;
  size?: number;
  storeName?: string;
  description?: string;
  driverOrder?: string[];
  dbKey?: string;
}