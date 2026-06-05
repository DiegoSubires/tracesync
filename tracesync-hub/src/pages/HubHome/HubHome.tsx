// src/pages/HubHome/HubHome.tsx
import type { AppRegistry } from "../../types/domain";
import AppCard from "../../components/AppCard";
import styles from "./HubHome.module.scss";

interface HubHomeProps {
  apps: AppRegistry[];
  onSelectModule: (appId: string) => void;
}

export default function HubHome({ apps = [], onSelectModule }: HubHomeProps) {
  console.log("🛠️ [HubHome] Apps recibidas para renderizado:", apps);
  const handleAppClick = (appId: string) => {
    //console.log("🔍 [HubHome] Click detectado en app:", appId);
    onSelectModule(appId);
  };

  return (
    <div className={styles.hubContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Portal de Aplicaciones Activas</h1>
        <p className={styles.subtitle}>
          Seleccione el módulo de la línea para habilitar el inicio de jornada
          técnica:
        </p>
      </div>

      <div className={styles.grid}>
        {apps.map((app) => (
          <AppCard
            key={app.appId}
            app={app}
            onSelect={() => handleAppClick(app.appId)}
          />
        ))}
      </div>
    </div>
  );
}
