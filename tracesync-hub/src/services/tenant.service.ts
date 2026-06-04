import { type TenantInfo } from "../types/domain";
import { apiClient } from "./apiClient";

export const TenantService = {
  async getTenantConfig(tenantId: string): Promise<TenantInfo> {
    /*const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tenant-config/${tenantId}`,
    );*/
    const response = await apiClient(`/api/tenant-config/${tenantId}`);
    if (!response.ok)
      throw new Error("Error al obtener configuración del tenant");

    const data = await response.json();

    return {
      tenantId: tenantId,
      businessName: data.businessName || "Nombre de Empresa no definido",
      companyAddress: data.companyAddress || "Dirección no disponible",
      logoUrl: data.logoUrl,
    };
  },
};
