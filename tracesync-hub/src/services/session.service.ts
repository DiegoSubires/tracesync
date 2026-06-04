// src/services/session.service.ts
import { type AuthSessionState, type TenantInfo } from "../types/domain";

export const SessionService = {
  save(data: AuthSessionState) {
    localStorage.setItem("ts_session", JSON.stringify(data));
    document.cookie = `ts_session=${btoa(JSON.stringify(data))}; path=/; SameSite=Strict`;
  },

  get(): AuthSessionState | null {
    const data = localStorage.getItem("ts_session");
    return data ? JSON.parse(data) : null;
  },

  clearSession() {
    localStorage.removeItem("ts_session");
    document.cookie =
      "ts_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },

  getLogo(tenant: TenantInfo | null): string {
    if (!tenant?.logoUrl) return "";
    return tenant.logoUrl.startsWith("data:image")
      ? tenant.logoUrl
      : `data:image/png;base64,${tenant.logoUrl}`;
  },
};
