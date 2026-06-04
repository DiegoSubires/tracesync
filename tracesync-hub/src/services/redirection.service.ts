import { type AppRegistry, type UserSession } from "../types/domain";

export const RedirectionService = {
  execute(app: AppRegistry, operator: UserSession, tenantId: string) {
    const maxAge = 8 * 60 * 60;
    const secureFlag =
      window.location.hostname !== "localhost" ? "Secure;" : "";

    document.cookie = `auth_operator=${encodeURIComponent(operator.name)}; max-age=${maxAge}; path=/; SameSite=Lax; ${secureFlag}`;
    document.cookie = `auth_tenant=${encodeURIComponent(tenantId)}; max-age=${maxAge}; path=/; SameSite=Lax; ${secureFlag}`;

    window.location.assign(app.url);
  },
};
