import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  message: string;

  constructor(private storage: Storage) {
  }

  async ionViewWillEnter() {
    await this.storage.create();
    this.message = 'Press Set, Then Press Get';
  }

  async setValue() {
    await this.storage.set('name', 'Max');
  }

  async getValue() {
    const value = await this.storage.get('name');
    this.message = `Got value ${value}`;
    console.log(this.message);
  }

  async enumerate() {
    this.storage.forEach((value, key, index) => {
      this.message = `ITEM - ${key} = ${value} [${index}]`
      console.log(this.message);
    });
  }
}
