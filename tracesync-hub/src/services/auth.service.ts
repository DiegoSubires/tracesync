// src/services/auth.service.ts
import { type AuthSessionState } from "../types/domain";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSessionState> {
    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    // Guardar el token en el servicio o dejar que el componente lo maneje
    localStorage.setItem("tracesync_token", data.token);

    return {
      user: data.user,
      tenant: data.tenant,
      apps: data.apps,
    };
  },
};
