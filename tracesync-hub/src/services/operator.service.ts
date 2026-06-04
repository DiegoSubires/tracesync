// src/services/operator.service.ts
import { type UserSession } from "../types/domain";

export const OperatorService = {
  async verifyOperatorPin(appId: string, pin: string): Promise<UserSession> {
    if (!appId) throw new Error("ID de aplicación no definido");
    if (!pin || pin.length === 0) throw new Error("PIN no proporcionado");

    const response = await fetch(`http://localhost:4000/api/operators/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
};
