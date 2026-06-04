// src/components/LayoutHub/LayoutHub.vm.ts
import { type TenantInfo, type UserSession } from "../../types/domain";

export interface PortalLayoutProps {
  children: React.ReactNode;
  tenant?: TenantInfo | null;
  user?: UserSession | null;
  isPinScreen?: boolean;
  onLogout: () => void;
  onGoBack?: () => void; // Volver al catálogo desde la pantalla del PIN
}
