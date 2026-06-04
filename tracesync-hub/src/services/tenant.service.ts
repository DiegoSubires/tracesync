import { type TenantInfo } from "../types/domain";

export const TenantService = {
  async getTenantConfig(tenantId: string): Promise<TenantInfo> {
    const response = await fetch(
      `http://localhost:4000/api/tenant-config/${tenantId}`,
    );
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
