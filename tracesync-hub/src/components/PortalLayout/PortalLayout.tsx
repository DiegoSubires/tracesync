/*import React from "react";
import type { TenantInfo, UserSession } from "../../types/auth";
import styles from "./portal-layout.module.scss"; // 🌟 Cambiado a CSS Modules puro

interface PortalLayoutProps {
  tenant: TenantInfo | null;
  user: UserSession | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function PortalLayout({
  tenant,
  user,
  onLogout,
  children,
}: PortalLayoutProps) {
  return (
    <div className={styles.portalWrapper}>
      {/* Navbar Corporativo /}
      <header className={styles.headerBar}>
        <div className={styles.headerContainer}>
          {/* Lado Izquierdo: Identidad del Cliente /}
          <div className={styles.leftSection}>
            {tenant?.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={`Logo ${tenant.businessName}`}
                className={styles.logoImage}
              />
            ) : (
              <div className={styles.logoFallback}>TS</div>
            )}
            <div className={styles.brandMeta}>
              <span className={styles.companyName}>
                {tenant?.businessName || "Terminal Central"}
              </span>
              <span className={styles.portalLabel}>Portal de Operaciones</span>
            </div>
          </div>

          {/* Lado Derecho: Info del Operario y Salida /}
          <div className={styles.rightSection}>
            <div className={styles.operatorInfo}>
              <span className={styles.operatorName}>
                {user?.name || "Operario No Identificado"}
              </span>
              <span className={styles.operatorRole}>
                {user?.role || "Acreditación Requerida"}
              </span>
            </div>

            <button onClick={onLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Área de Contenido Principal Estabilizada /}
      <main className={styles.mainContent}>{children}</main>

      {/* Footer Fijo de Planta /}
      <footer className={styles.footerBar}>
        <div className={styles.footerContainer}>
          <span>Infraestructura Sync Hub v4.0.0</span>
          <span>Planta Conectada</span>
        </div>
      </footer>
    </div>
  );
}*/
import React from "react";
import { SessionService } from "../../services/session.service";
import styles from "./portal-layout.module.scss";

interface PortalLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

export default function PortalLayout({
  onLogout,
  children,
}: PortalLayoutProps) {
  const session = SessionService.get();
  const { tenant, user } = session ?? { tenant: null, user: null };

  // Normalización del logo (detecta si es Base64 o URL)
  const logoSrc = SessionService.getLogo(tenant);

  return (
    <div className={styles.portalWrapper}>
      <header className={styles.headerBar}>
        <div className={styles.headerContainer}>
          <div className={styles.leftSection}>
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className={styles.logoImage} />
            ) : (
              <div className={styles.fallbackLogo}>TS</div>
            )}

            <div className={styles.brandMeta}>
              <span className={styles.companyName}>
                {tenant?.businessName || "TraceSync"}
              </span>
              <span className={styles.pageLabel}>Portal de Operaciones</span>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.operatorInfo}>
              <span className={styles.operatorName}>
                {user?.name || "Invitado"}
              </span>
              <span className={styles.operatorRole}>
                {user?.role || "Acreditado"}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className={styles.logoutButton}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      {/* Ajustado a la clase .footer definida en SASS */}
      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <span>{tenant?.businessName}</span>
          <span>{tenant?.companyAddress}</span>
        </div>
      </footer>
    </div>
  );
}
