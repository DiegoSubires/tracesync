/*import React, { useState } from "react";
import GatewayLogin from "../GatewayLogin/GatewayLogin";
import HubHome from "../../pages/HubHome";
import styles from "./app-router.module.scss";

interface AppRouterProps {
  screen: "COMPANY_LOGIN" | "HUB" | "MODULE_OPERATOR_LOGIN" | "MODULE_ACTIVE";
  apps: any[];
  selectedModule: string | null;
  onCompanyLoginSuccess: (data: any) => void;
  onSelectModule: (appId: string) => void;
  onExitModule: () => void;
  onOperatorVerifySuccess: (operatorData: any) => void;
}

export default function AppRouter({
  screen,
  apps,
  selectedModule,
  onCompanyLoginSuccess,
  onSelectModule,
  onExitModule,
  onOperatorVerifySuccess,
}: AppRouterProps) {
  const [pin, setPin] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (screen === "COMPANY_LOGIN") {
    return <GatewayLogin onLoginSuccess={onCompanyLoginSuccess} />;
  }

  if (screen === "HUB") {
    return <HubHome apps={apps} onSelectModule={onSelectModule} />;
  }

  if (screen === "MODULE_OPERATOR_LOGIN") {
    const currentApp = apps.find((a) => a.appId === selectedModule);
    const destinationUrl = currentApp?.url || "https://google.com";

    const handleVerifyPin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!pin) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:4000/api/operators/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pin,
              appId: selectedModule, // 🚀 ENVIAMOS: El id del módulo en el que se intenta entrar (Ej: "chamber_inventory" o "sanitation_management")
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "PIN incorrecto.");
          setLoading(false);
          return;
        }

        onOperatorVerifySuccess({
          name: data.name,
          role: data.role,
        });

        window.location.href = destinationUrl;
      } catch (err) {
        setError("Error de conexión con el servidor.");
        setLoading(false);
      }
    };
    return (
      <div className={styles.cardContainer}>
        <span className={styles.badge}>Seguridad de Línea</span>
        <h2 className={styles.title}>Verificar Fichaje</h2>
        <p className={styles.subtitle}>
          Módulo:{" "}
          <strong style={{ color: "#22d3ee" }}>
            {currentApp?.name || selectedModule}
          </strong>
        </p>

        <form onSubmit={handleVerifyPin} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="PIN de Operario"
              className={styles.pinInput}
              maxLength={6}
              required
              autoFocus
              value={pin}
              onChange={(e) => {
                const valorBruto = e.target.value;
                const valorFiltrado = valorBruto.replace(/\D/g, "");

                // 🧪 LOGS CLAVE EN TIEMPO REAL
                console.log("----------------------------------------");
                console.log("⌨️ [EVENTO TECLADO] Pulsación detectada");
                console.log(
                  "🔹 Valor crudo que viene del input:",
                  `"${valorBruto}"`,
                );
                console.log(
                  "🔹 Valor numérico tras filtrado:",
                  `"${valorFiltrado}"`,
                );
                console.log("----------------------------------------");

                setPin(valorFiltrado);
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className={`${styles.eyeButton} ${showPin ? styles.eyeButtonActive : ""}`}
            >
              {showPin ? "Ocultar" : "Ver"}
            </button>
          </div>

          {error && (
            <div
              style={{
                color: "#f87171",
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => {
                setPin("");
                onExitModule();
              }}
              className={styles.btnCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              Validar y Entrar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}*/

// src/components/AppRouter/AppRouter.tsx
import { useState } from "react";
import GatewayLogin from "../GatewayLogin/GatewayLogin";
import HubHome from "../../pages/HubHome/HubHome";
import { PinLoginForm } from "../PinLoginForm/PinLoginForm";
import { OperatorService } from "../../services/operator.service";
import {
  type AppRegistry,
  type AuthSessionState,
  type UserSession,
} from "../../types/domain";

export type ScreenType = "COMPANY_LOGIN" | "HUB" | "MODULE_OPERATOR_LOGIN";

interface AppRouterProps {
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  apps: AppRegistry[];
  selectedModule: string | null;
  onLoginSuccess: (session: AuthSessionState) => void;
  onSelectModule: (appId: string) => void;
  onOperatorVerifySuccess: (data: UserSession) => void;
  onExitModule: () => void;
  onLogout?: () => void;
}

export default function AppRouter({
  screen,
  setScreen,
  apps,
  selectedModule,
  onLoginSuccess,
  onSelectModule,
  onOperatorVerifySuccess,
  //onExitModule,
}: AppRouterProps) {
  const currentApp = apps.find((a) => a.appId === selectedModule);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (pin: string) => {
    if (!selectedModule) {
      setError("No se ha seleccionado una aplicación válida.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const operator = await OperatorService.verifyOperatorPin(
        selectedModule!,
        pin,
      );
      onOperatorVerifySuccess(operator);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  switch (screen) {
    case "COMPANY_LOGIN":
      return <GatewayLogin onLoginSuccess={onLoginSuccess} />;

    case "HUB":
      return (
        <HubHome
          apps={apps}
          onSelectModule={(appId) => {
            onSelectModule(appId);
            setScreen("MODULE_OPERATOR_LOGIN");
          }}
        />
      );

    case "MODULE_OPERATOR_LOGIN":
      return (
        <PinLoginForm
          appName={currentApp?.name || "Aplicación no encontrada"}
          loading={loading}
          error={error}
          onVerify={handleVerify}
          //onCancel={() => setScreen("HUB")}
          //onBack={() => setScreen("HUB")}
        />
      );

    default:
      return null;
  }
}
