import { IonApp, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { Database, Storage } from '@ionic/storage';

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

const App: React.FC = () => {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    async function initDb() {
      const store = new Storage();

      const db = await store.create();

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
