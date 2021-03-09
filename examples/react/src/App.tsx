import { IonApp, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { Database, Storage, Drivers } from '@ionic/storage';

import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';

/*
const IonicSecureStorageStub = {
  async create(config: any) {
    return IonicSecureStorageStubDB;
  }
}

const IonicSecureStorageStubDB = {
  async executeSql(...args: any[]) {}
}

// Implement the driver here.
var ionicSecureStorageDriver = {
    _driver: 'ionicSecureStorage',
    _initStorage: async function(options: any) {
      console.log('In init driver');
      throw new Error('Ionic Secure Storage not available');
    },
    clear: function(callback: any) {
    },
    getItem: function(key: any, callback: any) {
    },
    iterate: function(iteratorCallback: any, successCallback: any) {
    },    
    key: function(n: any, callback: any) {
    },
    keys: function(callback: any) {
    },
    length: function(callback: any) {
    },
    removeItem: function(key: any, callback: any) {
    },
    setItem: function(key: any, value: any, callback: any) {
    }
}
*/

const App: React.FC = () => {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    async function initDb() {
      const store = new Storage({
        driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
      });

      await store.defineDriver(IonicSecureStorageDriver);
      const db = await store.create();

      try {
        store.setEncryptionKey('fake');
      } catch (e) {
        console.error('Unable to set encryption key');
        console.error(e.message);
      }

      console.log('Created db', db.driver);

      setDb(db);
    }

    initDb();
  }, []);

  const runSet = () => {
    db.set('name', 'Max');
  }

  const runGet = async () => {
    const val = await db.get('name');
    console.log('Got value', val);
  }

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Test</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonButton onClick={runSet}>Set</IonButton>
          <IonButton onClick={runGet}>Get</IonButton>
        </IonContent>
      </IonPage>
    </IonApp>
  )
};

export default App;
