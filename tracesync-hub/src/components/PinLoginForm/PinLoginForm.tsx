// src/components/PinLoginForm/PinLoginForm.tsx

import { useState, useEffect, useRef } from "react";
import styles from "./PinLoginForm.module.scss";

interface PinLoginFormProps {
  appName: string;
  loading: boolean;
  error: string;
  onVerify: (pin: string) => void;
}

export function PinLoginForm({
  appName,
  loading,
  error,
  onVerify,
}: PinLoginFormProps) {
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 0) return;
    onVerify(pin);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.appTitle}>{appName}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Ingrese su PIN operativo</label>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            className={styles.input}
            value={pin}
            onChange={(e) => {
              // Blindaje: Solo permitimos dígitos en el estado
              const cleanValue = e.target.value.replace(/[^0-9]/g, "");
              setPin(cleanValue);
            }}
          />
        </div>

        {/* Aquí aplicamos la clase de estilo */}
        {error && <p className={styles.errorMessage}>⚠️ {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Verificando..." : "Validar y Entrar"}
        </button>
      </form>
    </div>
  );
}
