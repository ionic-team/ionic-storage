[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fionic-team%2Fionic-storage%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/ionic-team/ionic-storage/goto?ref=main)

# Ionic Storage

A simple key-value Storage module for Ionic apps. This utility uses the best storage engine available on the platform without having to interact with it directly (some configuration required, see docs below).

As of 3.x, this library now supports any JavaScript project (old versions only supported Angular), and Angular-specific functionality has been moved to a new `@ionic/storage-angular` package.

Out of the box, Ionic Storage will use `IndexedDB` and `localstorage` where available. To use SQLite for native storage, see the [SQLite Installation](#sqlite-installation) instructions.

For teams building security sensitive applications requiring encryption, 3.x now supports encryption through Ionic Secure Storage, see [Encryption Support](#encryption-support) for instructions on using it.

## Installation

```shell
npm install @ionic/storage
```

If using Angular, install the `@ionic/storage-angular` library instead:

```shell
npm install @ionic/storage-angular
```

If you'd like to use SQLite as a storage engine, see the [SQLite Installation](#sqlite-installation) instructions.

## Usage

### With React, Vue, Vanilla JavaScript

```typescript
import { Storage } from '@ionic/storage';

const store = new Storage();
await store.create();
```

See the [API](#api) section below for an overview of the supported methods on the storage instance.

### With Angular

Usage in Angular using Services and Dependency Injection requires importing the `IonicStorageModule` and then injecting the `Storage` class.

First, edit your NgModule declaration in `src/app/app.module.ts` or in the module for the component you'll use the storage library in, and add  `IonicStorageModule` as an import:

```typescript
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    IonicStorageModule.forRoot()
  ]
})
export class AppModule { }
```

Next, inject `Storage` into a component. Note: this approach is meant for usage in a single component (such as `AppComponent`). In this case, `create()` should only be called once. For use in multiple components, we recommend creating a service (see next example).

```typescript
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(private storage: Storage) {
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }
}
```

For more sophisticated usage, an Angular Service should be created to manage all database operations in your app and constrain all configuration and database initialization to a single location. When doing this, don't forget to register this service in a `providers` array in your `NgModule` if not using `providedIn: 'root'`, and ensure that the `IonicStorageModule` has been initialized in that `NgModule` as shown above. Here's an example of what this service might look like:

```typescript
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}
```

Then, inject the `StorageService` into your pages and other components that need to interface with the Storage engine.

## API

The Storage API provides ways to set, get, and remove a value associated with a key, along with clearing the database, accessing the stored keys and their quantity, and enumerating the values in the database.

To set an item, use `set(key, value)`:

```javascript
await storage.set('name', 'Mr. Ionitron');
```

To get the item back, use `get(name)`:

```javascript
const name = await storage.get('name');
```

To remove an item:

```javascript
await storage.remove(key);
```

To clear all items:

```javascript
await storage.clear();
```

To get all keys stored:

```javascript
await storage.keys()
```

To get the quantity of key/value pairs stored:

```javascript
await storage.length()
```

To enumerate the stored key/value pairs:
```javascript
storage.forEach((key, value, index) => {
});
```

To enable encryption when using the [Ionic Secure Storage](https://ionic.io/docs/secure-storage) driver:

```javascript
storage.setEncryptionKey('mykey');
```

See [Encryption Support](#encryption-support) below for more information.

## Configuration

The Storage engine can be configured both with specific storage engine priorities, or custom configuration
options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration

### In React/Vue/Vanilla JavaScript configuration

Pass configuration options in the `Storage` constructor:

```typescript
const storage = new Storage({
  name: '__mydb',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});
```

### Angular configuration

```typescript
import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  //...
  imports: [
   IonicStorageModule.forRoot({
     name: '__mydb',
     driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
   })
 ],
 //...
})
export class AppModule { }
```

## SQLite Installation

The 2.x version of this plugin hard coded in the [localForage-cordovaSQLiteDriver](https://github.com/thgreasi/localForage-cordovaSQLiteDriver). This driver has been removed from the core code as of 3.x to provide more options for SQLite storage engines.

In 3.x there are at least two good options for SQLite usage:

1) For non-enterprise apps, the old `localForage-cordovaSQLiteDriver` is still a fine choice but does not support encryption and is community maintained. See below for installation instructions.

2) For enterprise apps, we strongly recommend [Ionic Secure Storage](https://ionic.io/docs/secure-storage) which is an enterprise SQLite engine with full encryption support out of the box and is fully supported and maintained by the Ionic team.

### Using `localForage-CordovaSQLiteDriver`

#### Installation

```
# If using Cordova, install the plugin using 
ionic cordova plugin add cordova-sqlite-storage
# If using Capacitor, install the plugin using
npm install cordova-sqlite-storage

# Then, install the npm library
npm install localforage-cordovasqlitedriver
```

#### Adding driver to configuration

For non-Angular projects, pass the `CordovaSQLiteDriver._driver` to the `driverOrder` config option:

```typescript
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const store = new Storage({
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
});
```

In Angular, pass the same configuration when importing the `IonicStorageModule` in your page or app `NgModule`:

```typescript
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@NgModule({
  imports: [
    // ...,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
    })
  ],
  // ...
})
export class MyPageModule { }
```

#### Registering Driver

Finally, to register the driver, run `defineDriver()` on the storage instance to register the driver, making sure to call this before any data operations:

```typescript
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

const store = new Storage({
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
});

await this.storage.defineDriver(CordovaSQLiteDriver);
```

### Using Ionic Secure Storage


[Ionic Secure Storage](https://ionic.io/docs/secure-storage) is an enterprise-ready, high-performance data store with SQL or key/value support and offering 256-bit AES encryption. When used in tandem with [Ionic Identity Vault](https://ionic.io/products/identity-vault), developers can securely manage encryption keys and build fully offline-enabled apps with biometric authentication using the fullest security capabilities available on modern mobile devices and operating systems.

Ionic Secure Storage is an enterprise product and requires an active enterprise subscription or trial. To learn more and request a demo, visit the [Secure Storage product page](https://ionic.io/products/offline-storage).

#### Installation

Follow the [official installation guide](https://ionic.io/docs/secure-storage) to set up and install `@ionic-enterprise/secure-storage`.

### Usage

#### With React, Vue, Vanilla JavaScript

```typescript
import { Drivers } from '@ionic/storage';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';

const store = new Storage({
  driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
});

await store.defineDriver(IonicSecureStorageDriver);
```

#### With Angular

Usage in Angular using Services and Dependency Injection requires importing the `IonicStorageModule` and then injecting the `Storage` class.

First, edit your NgModule declaration in `src/app/app.module.ts` or in the module for the page you'll use the storage library in, and add  `IonicStorageModule` as an import:

```typescript
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  // ...
})
export class AppModule { }
```

Then register the driver in your component:

```typescript

  async ngOnInit() {
    await this.storage.defineDriver(IonicSecureStorageDriver);
    await this.storage.create();
  }
```

Then follow the instructions below to configure encryption support:

## Encryption Support

3.x adds a new method `setEncryptionKey` to support encryption when using with [Ionic Secure Storage](https://ionic.io/docs/secure-storage) (see instructions above).

This is an enterprise feature for teams with high security needs and provides the ability to use the simple `@ionic/storage` key-value API, or drop down to SQL for more powerful query and relational data support, all with full encryption. When paired with [Ionic Identity Vault](https://ionic.io/docs/identity-vault) teams can safely manage encryption keys and provide biometric authentication when on or offline.

Visit the [Secure Storage](https://ionic.io/products/secure-storage) product page to learn more about Secure Storage and inquire about a trial.

### Encrypting an Existing SQLite Database

A one-time migration must be performed to move to a new, encrypted database powered by [Ionic Secure Storage](https://ionic.io/docs/secure-storage).

First, follow the installation steps above to update to Ionic Storage v3, install the `localForage-CordovaSQLiteDriver` SQLite driver, and integrate Ionic Secure Storage.

Next, remove the database name and drivers, if used, from `app.module.ts`:

```typescript
@NgModule({
  imports: [
    // ...,
    IonicStorageModule.forRoot()
  ],
  // ...
})
export class MyPageModule { }
```

Finally, in the service class, create a one time migration function that migrates data to an encrypted database. Execute this function on app load.

```typescript
async migrateDatabase() {
  const origStore = new Storage({
    name: 'originalDB', // the original database name
    driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
  });
  await origStore.defineDriver(CordovaSQLiteDriver);

  const newStore = new Storage({
    name: 'encryptedDB', // pick a new db name for the encrypted db
    driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
  });
  await newStore.defineDriver(IonicSecureStorageDriver);
  newStore.setEncryptionKey('mykey');

  if (await origStore.length() > 0) {
    // copy existing data into new, encrypted format
    await origStore.forEach((key, value, index) => {
      newStore.set(key, value);
    });

    // remove old data
    await origStore.clear();
  }

  this._storage = newStore;
}
```
