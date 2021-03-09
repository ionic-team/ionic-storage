import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private storage: Storage) {
    console.log('Got storage here', storage);

    storage.create();
  }

  async setValue() {
    await this.storage.set('name', 'Max');
  }

  async getValue() {
    const value = await this.storage.get('name');
    console.log('Got value', value);
  }

}
