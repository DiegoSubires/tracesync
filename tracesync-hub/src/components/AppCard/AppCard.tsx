import styles from "./AppCard.module.scss";

interface AppData {
  appId: string;
  name: string;
  description?: string;
  url?: string;
}

interface AppCardProps {
  app: AppData;
  onSelect: (appId: string) => void;
}

export default function AppCard({ app, onSelect }: AppCardProps) {
  // Extraemos las dos primeras letras como iniciales del icono si no hay uno gráfico
  const iconFallback = app.appId.slice(0, 2).toUpperCase();

  return (
    <div className={styles.cardContainer} onClick={() => onSelect(app.appId)}>
      <div className={styles.topContent}>
        {/* Icono de la MicroApp */}
        <div className={styles.iconWrapper}>{iconFallback}</div>

        {/* Título y Detalles */}
        <h3 className={styles.cardTitle}>{app.name}</h3>
        <p className={styles.cardDescription}>
          {app.description ||
            "Módulo operativo conectado al ecosistema TraceSync."}
        </p>
      </div>

      {/* Enlace de Acción Inferior */}
      <span className={styles.actionLink}>Acceder al módulo ➔</span>
    </div>
  );
}
