[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fionic-team%2Fionic-storage%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/ionic-team/ionic-storage/goto?ref=main)

# Ionic Storage

A simple key-value Storage module for Ionic apps. This utility uses the best storage engine available on the platform without having to interact with it directly (some configuration required, see docs below).

As of 3.x, this library now supports any JavaScript project (old versions only supported Angular), and Angular-specific functionality has been moved to a new `@ionic/storage-angular` package.

Out of the box, Ionic Storage will use `IndexedDB` and `localstorage` where available. To use SQLite for native storage, see the [SQLite Installation](#sqlite-installation) instructions.

For teams building security sensitive applications requiring encryption, 3.x now supports encryption through Ionic Secure Storage, see [Encryption Support](#encryption-support) for instructions on using it.

### Installation

```shell
npm install @ionic/storage
```

When using Angular, install the additional `@ionic/storage-angular` library:

```shell
npm install @ionic/storage-angular
```

If you'd like to use SQLite as a storage engine, see the [SQLite Installation](#sqlite-installation) instructions.

### Usage - React, Vue, Vanilla JavaScript

```typescript
const store = new Storage();
await store.create();
```

See the [Usage - API](#usage-api) section below for an overview of the supported methods on the storage instance.

### Usage - Angular

Usage in Angular using Services and Dependency Injection requires importing the `IonicStorageModule` and then injecting the `Storage` class.

First, edit your NgModule declaration in `src/app/app.module.ts` or in the module for the page you'll use the storage library in, and add  `IonicStorageModule` as an import:

```typescript
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ...
  ],
  providers: [
    ...
  ]
})
export class AppModule { }
```

Next, inject `Storage` into a component:

```typescript
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private storage: Storage) {
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }
}
```

## Usage - API

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

### Configuring Storage

The Storage engine can be configured both with specific storage engine priorities, or custom configuration
options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration

#### React/Vue/Vanilla JavaScript configuration

Pass configuration options in the `Storage` constructor:

```typescript
const storage = new Storage({
  name: '__mydb',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});
```

#### Angular configuration

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
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const store = new Storage({
  driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
});
```

In Angular, pass the same configuration when importing the `IonicStorageModule` in your page or app `NgModule`:

```typescript
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

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
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

await this.storage.defineDriver(CordovaSQLiteDriver);
```

### Using Ionic Secure Storage


[Ionic Secure Storage](https://ionic.io/secure-storage) is an enterprise-ready, high-performance data store with SQL or key/value support and offering 256-bit AES encryption. When used in tandem with [Ionic Identity Vault](https://ionic.io/identity-vault), developers can securely manage encryption keys and build fully offline-enabled apps with biometric authentication using the fullest security capabilities available on modern mobile devices and operating systems.

Ionic Secure Storage is an enterprise product and requires an active enterprise subscription or trial. To learn more and request a demo, visit the [Secure Storage product page](https://ionic.io/products/offline-storage).

#### Installation

Follow the [official installation guide](https://ionic.io/docs/secure-storage) to set up and install `@ionic-enterprise/secure-storage`.

### Usage - React, Vue, Vanilla JavaScript

```typescript
import { Drivers } from '@ionic/storage';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';

const store = new Storage({
  driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
});

await store.defineDriver(IonicSecureStorageDriver);
```

### Usage - Angular

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

3.x adds a new method `setEncryptionKey` to support encryption when using with [Ionic Secure Storage](https://ionic.io/docs/secure-storage).

This is an enterprise feature for teams with high security needs and provides the ability to use the simple `@ionic/storage` key-value API, or drop down to SQL for more powerful query and relational data support, all with full encryption. When paired with [Ionic Identity Vault](https://ionic.io/docs/identity-vault) teams can safely manage encryption keys and provide biometric authentication when on or offline.

Visit the [Secure Storage](https://ionic.io/products/secure-storage) product page to learn more about Secure Storage and inquire about a trial.
