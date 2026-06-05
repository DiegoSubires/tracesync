import React, { useState } from "react";
import type { AuthSessionState } from "../../types/domain";
import styles from "./Gateway-login.module.scss";
import { AuthService } from "../../services/auth.service";

interface GatewayLoginProps {
  onLoginSuccess: (sessionData: AuthSessionState) => void;
}

export default function GatewayLogin({ onLoginSuccess }: GatewayLoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /*const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sessionData = await AuthService.login(email, password);
      onLoginSuccess(sessionData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al iniciar sesión");
      }
      setLoading(false);
    }
  };*/
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sessionData = await AuthService.login(email, password);
      /*console.log(
        "✅ [GatewayLogin] Login exitoso, datos recibidos:",
        sessionData,
      );*/
      onLoginSuccess(sessionData);
    } catch (err: unknown) {
      //console.error("❌ [GatewayLogin] Error capturado:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al iniciar sesión");
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Encabezado eliminado para simplificar la vista y evitar redundancia */}

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email de Empresa</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="usuario@empresa.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Autenticando..." : "Ingresar al Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
}
