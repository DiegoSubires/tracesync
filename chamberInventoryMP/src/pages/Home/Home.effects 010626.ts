// src/modules/home/Home.effects.ts
import { useEffect } from "react";
import { ProductService } from "../../services/product.service";
import { type Product } from "./Home.vm";

export const useHomeEffects = (
  tenantId: string,
  setLoading: (l: boolean) => void,
  setProducts: (p: Product[]) => void,
) => {
  useEffect(() => {
    if (!tenantId) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await ProductService.fetchAllProducts(tenantId);
        if (mounted) setProducts(data);
      } catch (err) {
        console.error("❌ [Home.effects] Error cargando productos:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
    // ✅ SOLUCIÓN ESLINT: Ahora podemos incluir las funciones porque están protegidas con useCallback en Home.tsx
  }, [tenantId, setLoading, setProducts]);
};
