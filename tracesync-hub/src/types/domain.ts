// src/types/domain.ts

export interface TenantInfo {
  tenantId: string;
  businessName: string;
  companyAddress: string;
  logoUrl: string;
}

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  role: string;
  group: string;
  avatarBase64?: string;
}

export interface AppRegistry {
  appId: string;
  name: string;
  url: string;
  description?: string;
}

export interface AuthSessionState {
  user: UserSession | null;
  tenant: TenantInfo | null;
  apps: AppRegistry[];
}
