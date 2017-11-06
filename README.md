[![Circle CI](https://circleci.com/gh/ionic-team/ionic-storage.svg?style=shield)](https://circleci.com/gh/ionic-team/ionic-storage)

# Ionic Storage
A simple key-value Storage module for Ionic apps based on LocalForage, with out-of-the-box support for SQLite. This utility makes it easy to use the best storage engine available without having to interact with it directly. Currently the ordering is SQLite, IndexedDB, WebSQL, and LocalStorage.

One reason we prioritize SQLite is because of some OS-dependent issues with storage in the browser in native apps. As a major example, iOS will currently clear out Local Storage (and IndexedDB it's been shown) when the device runs low on memory. To avoid that, a file-based storage approach with SQLite will retain all your data.

If you want to perform arbitrary SQL queries and have one of the best storage options around, we recommend using the [Ionic Native SQLite plugin](https://ionicframework.com/docs/v2/native/sqlite/) directly. This engine no longer supports the `query` feature underneath as it was not portable and only worked for SQLite anyways.

For those coming from Ionic pre RC.0, here is more insight in to the reason for us moving to this module: https://github.com/ionic-team/ionic/issues/8269#issuecomment-250590367

### Installation

To use this in your Ionic /Angular apps, either start a fresh Ionic project which has it installed by default, or run:

```bash
npm install @ionic/storage
```

If you'd like to use SQLite as a storage engine, install a SQLite plugin (only works while running in a simulator or on device):

```bash
cordova plugin add cordova-sqlite-storage --save
```

### Usage



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

import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public storage: Storage) {
  }

}
```

To make sure the storage system is ready before using, call `Storage.ready()`. You must be
on 1.1.7 or greater to use the `ready()` method.

```javascript
storage.ready().then(() => {
});
```

To set an item, use `Storage.set(key, value)`:

```javascript
this.storage.set('name', 'Mr. Ionitron');
```

To get the item back, use `Storage.get(name).then((value) => {})` since `get()` returns a Promise:

```javascript
this.storage.get('name').then((name) => {
  console.log('Me: Hey, ' + name + '! You have a very nice name.');
  console.log('You: Thanks! I got it for my birthday.');
});
```

To remove the item, use `Storage.remove(key).then(() => { })`

### Configuring Storage (new in 1.1.7)

The Storage engine can be configured both with specific storage engine priorities, or custom configuration
options to pass to localForage. See the localForage config docs for possible options: https://github.com/localForage/localForage#configuration


```typescript
import { Storage } from '@ionic/storage';


@NgModule({
 declarations: ...,
 imports: [
   IonicStorageModule.forRoot({
     name: '__mydb',
     driverOrder: ['indexeddb', 'sqlite', 'websql']
   })
 ],
 bootstrap: ...,
 entryComponents: ...,
})
export class AppModule { }
```


### Development and release

When you're ready to release a new version, run the following commands:

1.  npm version (patch|minor|major)
2.  npm run build
3.  npm publish
