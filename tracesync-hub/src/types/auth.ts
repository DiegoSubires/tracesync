export interface UserSession {
  name: string;
  email: string;
  role: string;
  group: string;
}

export interface TenantInfo {
  tenantId: string;
  businessName: string;
  logoUrl: string;
}

export interface AppRegistry {
  appId: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface AuthSessionState {
  user: UserSession | null;
  tenant: TenantInfo | null;
  apps: AppRegistry[];
}
