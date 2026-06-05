// src/components/LayoutHub/LayoutHub.tsx
import React from "react";
import styles from "./LayoutHub.module.scss";
import { type PortalLayoutProps } from "./LayoutHub.vm";

export const LayoutHub: React.FC<PortalLayoutProps> = ({
  children,
  onLogout,
  onGoBack,
  tenant,
  user,
  isPinScreen,
}) => {
  return (
    <div className={styles.portalWrapper}>
      <header className={styles.headerBar}>
        <div className={styles.headerContainer}>
          {/* Columna Izquierda: Empresa y Contexto */}
          <div className={styles.leftSection}>
            {tenant?.logoUrl && (
              <img
                src={tenant.logoUrl}
                alt="Logo"
                className={styles.logoImage}
              />
            )}
            <div className={styles.brandMeta}>
              <span className={styles.companyName}>
                {tenant?.businessName || "TraceSync"}
              </span>
              <span className={styles.pageLabel}>Portal de Operaciones</span>
            </div>
          </div>

          {/* Columna Derecha: Datos de Sesión del Hub */}
          {user && (
            <div className={styles.rightSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>

              <div className={styles.actionsContainer}>
                {isPinScreen ? (
                  <button
                    type="button"
                    onClick={onGoBack}
                    className={styles.logoutButton}
                  >
                    Volver al Catálogo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onLogout}
                    className={styles.logoutButton}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      <footer className={styles.footerBar}>
        <div className={styles.footerContent}>
          <p>{tenant?.businessName}</p>
          <p>{tenant?.companyAddress}</p>
        </div>
      </footer>
    </div>
  );
};
