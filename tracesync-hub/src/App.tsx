/*import { useState } from "react";
import PortalLayout from "./components/PortalLayout";
import AppRouter from "./components/AppRouter/AppRouter";

type TargetScreen =
  | "COMPANY_LOGIN"
  | "HUB"
  | "MODULE_OPERATOR_LOGIN"
  | "MODULE_ACTIVE";

interface CompanySessionState {
  tenant: any;
  apps: any[];
}

export default function App() {
  const [screen, setScreen] = useState<TargetScreen>(() => {
    const token = localStorage.getItem("tracesync_token");
    return token ? "HUB" : "COMPANY_LOGIN";
  });

  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const [companySession, setCompanySession] = useState<CompanySessionState>(
    () => {
      const token = localStorage.getItem("tracesync_token");
      const savedTenant = localStorage.getItem("tracesync_tenant");
      const savedApps = localStorage.getItem("tracesync_apps");

      if (token && savedTenant && savedApps) {
        try {
          return {
            tenant: JSON.parse(savedTenant),
            apps: JSON.parse(savedApps),
          };
        } catch (err) {
          console.error("Error al parsear la sesión guardada", err);
        }
      }
      return { tenant: null, apps: [] };
    },
  );

  const [activeOperator, setActiveOperator] = useState<any>(null);

  // ⚙️ SECCIÓN RECTIFICADA: TRANSMISIÓN SEGURA MEDIANTE COOKIES INDUSTRIALES
  const redirigirAMicroapp = (appId: string, operatorData: any) => {
    console.log("\n=======================================================");
    console.log(
      "🍪 [PASARELA COOKIES] INICIANDO TRANSMISIÓN DE CRISTAL HACIA MICROAPP",
    );
    console.log(`🔹 ID Módulo: "${appId}" | Operario: "${operatorData.name}"`);

    const currentApp = companySession.apps.find(
      (a) => a.appId === appId || a.id === appId,
    );

    // Fallback de desarrollo (localhost) o producción (GitHub Pages)
    const baseUrl = currentApp?.url || "http://localhost:5175/";
    console.log(`📍 URL Destino: "${baseUrl}"`);

    try {
      // 📐 1. EXTRAER EL PATH DE LA REPETICIÓN (Para aislar la cookie por repositorio)
      // Si la URL es 'https://tracesync.github.io/moernoplaza-recuentocamaras/', el path es '/moernoplaza-recuentocamaras/'
      // Si estás en desarrollo 'http://localhost:5175/', el path será '/'
      let cookiePath = "/";
      if (baseUrl.includes("github.io")) {
        const urlObj = new URL(baseUrl);
        cookiePath = urlObj.pathname; // Captura el subdirectorio del repositorio
        if (!cookiePath.endsWith("/")) cookiePath += "/";
      }

      console.log(`🛡️ Ajustando alcance de Cookie (Path): "${cookiePath}"`);

      // 🕒 2. EXPIRACIÓN TÉCNICA RECOMENDADA (8 Horas de turno industrial)
      const maxAge = 8 * 60 * 60;

      // 🔐 3. ESCULPIR LAS COOKIES CON SUS ATRIBUTOS DE BLINDAJE
      // 'Secure' obliga a HTTPS en producción. 'SameSite=Lax' frena ataques CSRF externos.
      const secureFlag = baseUrl.includes("localhost") ? "" : "Secure;";

      document.cookie = `auth_operator=${encodeURIComponent(operatorData.name)}; max-age=${maxAge}; path=${cookiePath}; SameSite=Lax; ${secureFlag}`;
      document.cookie = `auth_tenant=${encodeURIComponent(companySession.tenant?.id || "moreno_plaza")}; max-age=${maxAge}; path=${cookiePath}; SameSite=Lax; ${secureFlag}`;
      document.cookie = `auth_section=${encodeURIComponent("Recuento de Cámaras")}; max-age=${maxAge}; path=${cookiePath}; SameSite=Lax; ${secureFlag}`;

      console.log(
        "✅ Cookies inyectadas en la memoria del navegador de forma segura.",
      );
      console.log("=======================================================");

      // 🚀 4. REDIRECCIÓN LIMPIA (Sin parámetros viciados que rompan o ensucien la URL)
      window.location.assign(baseUrl);
    } catch (error) {
      console.error("❌ Fallo crítico inyectando cookies industriales:", error);
      // Canal de pánico: Si falla la cookie, usamos la redirección física ordinaria
      window.location.href = baseUrl;
    }
  };

  const handleCompanyLoginSuccess = (data: any) => {
    localStorage.setItem("tracesync_token", data.token);
    localStorage.setItem("tracesync_tenant", JSON.stringify(data.tenant));
    localStorage.setItem("tracesync_apps", JSON.stringify(data.apps));

    setCompanySession({
      tenant: data.tenant,
      apps: data.apps,
    });
    setScreen("HUB");
  };

  const handleLogoutCompany = () => {
    localStorage.removeItem("tracesync_token");
    localStorage.removeItem("tracesync_tenant");
    localStorage.removeItem("tracesync_apps");
    setCompanySession({ tenant: null, apps: [] });
    setActiveOperator(null);
    setSelectedModule(null);
    setScreen("COMPANY_LOGIN");
  };

  const handleSelectModule = (appId: string) => {
    setSelectedModule(appId);
    setScreen("MODULE_OPERATOR_LOGIN");
  };

  const handleOperatorVerifySuccess = (operatorData: any) => {
    console.log("-------------------------------------------------------");
    console.log("✅ [OPERARIO ENTRANTE] Verificación de identidad superada.");

    setActiveOperator(operatorData);
    setScreen("MODULE_ACTIVE");

    if (selectedModule) {
      redirigirAMicroapp(selectedModule, operatorData);
    } else {
      console.error("❌ Error: 'selectedModule' es null.");
    }
  };

  if (screen === "COMPANY_LOGIN") {
    return (
      <AppRouter
        screen={screen}
        apps={[]}
        selectedModule={null}
        onCompanyLoginSuccess={handleCompanyLoginSuccess}
        onSelectModule={handleSelectModule}
        onExitModule={() => {}}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
      />
    );
  }

  return (
    <PortalLayout
      tenant={companySession.tenant}
      user={activeOperator}
      onLogout={handleLogoutCompany}
    >
      <AppRouter
        key={selectedModule || screen}
        screen={screen}
        apps={companySession.apps || []}
        selectedModule={selectedModule}
        onCompanyLoginSuccess={handleCompanyLoginSuccess}
        onSelectModule={handleSelectModule}
        onExitModule={() => setScreen("HUB")}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
      />
    </PortalLayout>
  );
}*/

/*/ src/App.tsx
import { useState } from "react";
import { SessionService } from "./services/session.service";
import PortalLayout from "./components/PortalLayout";
import AppRouter from "./components/AppRouter/AppRouter";

export default function App() {
  const [session, setSession] = useState(() => SessionService.get());

  const handleLogout = () => {
    SessionService.clearSession();
    setSession(null);
  };

  // Si no hay sesión, mostramos el login
  if (!session) {
    return <AppRouter screen="COMPANY_LOGIN" onLoginSuccess={setSession} />;
  }

  // Si hay sesión, usamos el PortalLayout como contenedor único
  return (
    <PortalLayout
      tenant={session.tenant}
      user={session.user}
      onLogout={handleLogout}
    >
      <AppRouter screen="HUB" apps={session.apps} onLogout={handleLogout} />
    </PortalLayout>
  );
}*/
import { useState } from "react";
import { LayoutHub } from "./components/LayoutHub/LayoutHub";
import AppRouter from "./components/AppRouter/AppRouter";
import { type AuthSessionState, type UserSession } from "./types/domain";
import { SessionService, RedirectionService } from "./services";

const DEFAULT_TENANT = {
  tenantId: "tracesync",
  businessName: "TraceSync",
  companyAddress: "Soluciones Industriales",
  logoUrl: `${import.meta.env.BASE_URL}logo.png`,
};

/*const URLS = {
  HUB: "https://tracesync.github.io/tracesync/", 
  MICROAPP: "https://tracesync.github.io/tracesync/chamberInventoryMP/" 
};*/

export default function App() {
  console.log("Quitar");
  /*const [session, setSession] = useState<AuthSessionState | null>(() =>
    SessionService.get(),
  );*/
  const [session, setSession] = useState<AuthSessionState | null>(() => {
    const data = SessionService.get();
    // LOG: Auditoría de carga inicial
    console.group("🔍 [DEBUG] Carga de Sesión");
    console.log("Datos recuperados:", data);
    console.log(
      "Apps permitidas:",
      data?.apps?.map((a) => a.appId),
    );
    console.groupEnd();
    return data;
  });

  const [activeOperator, setActiveOperator] = useState<UserSession | null>(
    null,
  );
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [screen, setScreen] = useState<
    "COMPANY_LOGIN" | "HUB" | "MODULE_OPERATOR_LOGIN"
  >("COMPANY_LOGIN");

  const handleOperatorVerifySuccess = (operator: UserSession) => {
    setActiveOperator(operator);
    // Una vez verificado, procedemos a la redirección usando el ID guardado
    if (selectedModule) {
      const app = session!.apps.find((a) => a.appId === selectedModule);
      if (app)
        RedirectionService.execute(app, operator, session!.tenant!.tenantId);
    }
  };

  const handleLogout = () => {
    SessionService.clearSession();
    setSession(null);
    setScreen("COMPANY_LOGIN");
  };

  /*const handleGoBack = () => {
    setScreen("HUB");
    setSelectedModule(null);
  };*/

  const currentTenant = session?.tenant || DEFAULT_TENANT;

  const handleSelectModule = (appId: string) => {
    const app = session?.apps.find((a) => a.appId === appId);
    if (!app) return;

    if (activeOperator) {
      RedirectionService.execute(
        app,
        activeOperator,
        session!.tenant!.tenantId,
      );
    } else {
      setSelectedModule(appId);
      setScreen("MODULE_OPERATOR_LOGIN");
    }
  };

  /*return (
    <LayoutHub
      onLogout={handleLogout}
      onGoBack={() => setScreen("HUB")}
      isPinScreen={screen === "MODULE_OPERATOR_LOGIN"}
      tenant={currentTenant}
      user={session?.user}
    >
      <AppRouter
        screen={screen}
        setScreen={setScreen}
        apps={session?.apps || []}
        selectedModule={selectedModule}
        onLoginSuccess={(data) => {
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    </LayoutHub>
  );
}*/

  if (!session) {
    return (
      <AppRouter
        screen="COMPANY_LOGIN"
        setScreen={setScreen}
        apps={[]}
        selectedModule={null}
        onLoginSuccess={(data) => {
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    );
  }

  // 2. Si HAY sesión, renderizamos el LayoutHub envolviendo al AppRouter
  return (
    <LayoutHub
      onLogout={handleLogout}
      onGoBack={() => setScreen("HUB")}
      isPinScreen={screen === "MODULE_OPERATOR_LOGIN"}
      tenant={currentTenant}
      user={session.user} // Asegúrate que session traiga el usuario aquí
    >
      <AppRouter
        screen={screen}
        setScreen={setScreen}
        apps={session.apps || []}
        selectedModule={selectedModule}
        onLoginSuccess={setSession}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    </LayoutHub>
  );
}
