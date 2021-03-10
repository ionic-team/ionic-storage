[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fionic-team%2Fionic-storage%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/ionic-team/ionic-storage/goto?ref=main)

# Ionic Storage

A simple key-value Storage module for Ionic apps. This utility uses the best storage engine available on the platform without having to interact with it directly (some configuration required, see docs below).

As of 3.x, this utility supports any JavaScript project (old versions only supported Angular), though there is now a new `@ionic/storage-angular` package with additional Angular functionality.

Out of the box, Ionic Storage will use `IndexedDB` and `localstorage` where available. To use SQLite for native storage, see the [SQLite Installation](#sqlite-installation) instructions.

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

### Usage - Angular

Then edit your NgModule declaration in `src/app/app.module.ts` to add `IonicStorageModule` as an import:

```typescript
import { IonicStorageModule } from '@ionic/storage';

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

Now, you can easily inject `Storage` into a component:

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

}
```

To set an item, use `Storage.set(key, value)`:

```javascript
await this.storage.set('name', 'Mr. Ionitron');
```

To get the item back, use `Storage.get(name).then((value) => {})` since `get()` returns a Promise:

```javascript
const name = await this.storage.get('name');
console.log('Me: Hey, ' + name + '! You have a very nice name.');
console.log('You: Thanks! I got it for my birthday.');
```

To remove an item:

```javascript
await this.storage.remove(key);
```

### Configuring Storage

The Storage engine can be configured both with specific storage engine priorities, or custom configuration
options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration

#### React/Vue/Vanilla JavaScript configuration

#### Angular configuration:

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

__Installing `localForage-cordovaSQLiteDriver`__

```
# If using Cordova, install the plugin using 
ionic cordova plugin add cordova-sqlite-storage
# If using Capacitor, install the plugin using
npm install cordova-sqlite-storage

# Then, install the npm library
npm install localforage-cordovasqlitedriver
```

__Adding driver to `driverOrder`__

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

__Registering driver__

Finally, to register the driver, run `defineDriver()` on the storage instance to register the driver, making sure to call this before any data operations:

```typescript
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

await this.storage.defineDriver(CordovaSQLiteDriver);
```

## Encryption Support

3.x adds a new method `setEncryptionKey` to support encryption when using with [Ionic Secure Storage](https://ionic.io/docs/secure-storage).

This is an enterprise feature for teams with high security needs and provides the ability to use the simple `@ionic/storage` key-value API, or drop down to SQL for more powerful query and relational data support, all with full encryption. When paired with [Ionic Identity Vault](https://ionic.io/docs/identity-vault) teams can safely manage encryption keys and provide biometric authentication when on or offline.

Visit the [Secure Storage](https://ionic.io/products/secure-storage) product page to learn more about Secure Storage and inquire about a trial.
