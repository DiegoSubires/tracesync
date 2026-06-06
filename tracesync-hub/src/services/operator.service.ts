/*/ src/services/operator.service.ts
import { type UserSession } from "../types/domain";

export const OperatorService = {
  async verifyOperatorPin(appId: string, pin: string): Promise<UserSession> {
    if (!appId) throw new Error("ID de aplicación no definido");
    if (!pin || pin.length === 0) throw new Error("PIN no proporcionado");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/operators/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, pin }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "PIN incorrecto o usuario no encontrado",
      );
    }

    return await response.json();
  },
};*/

/*import { type UserSession } from "../types/domain";
import { apiClient } from "./apiClient";

export const OperatorService = {
  async verifyOperatorPin(appId: string, pin: string): Promise<UserSession> {
    if (!appId) throw new Error("ID de aplicación no definido");
    if (!pin || pin.length === 0) throw new Error("PIN no proporcionado");

    const token = localStorage.getItem("tracesync_token"); // Recuperamos el token

    /*const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/operators/verify`,//
    const response = await apiClient("/api/operators/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Inyectamos el token
      },
      body: JSON.stringify({ appId, pin }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "PIN incorrecto o usuario no encontrado",
      );
    }

    return await response.json();
  },
};*/

import { type UserSession } from "../types/domain";
import { apiClient } from "./apiClient";

export const OperatorService = {
  async verifyOperatorPin(appId: string, pin: string): Promise<UserSession> {
    if (!appId) throw new Error("ID de aplicación no definido");
    if (!pin || pin.length === 0) throw new Error("PIN no proporcionado");

    const token = localStorage.getItem("tracesync_token");

    // Almacenamos el resultado directo en 'data'
    const data = await apiClient("/api/operators/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appId, pin }),
    });

    // Retornamos directamente 'data' porque apiClient ya hizo el response.json()
    return data;
    console.log(data);
  },
};
