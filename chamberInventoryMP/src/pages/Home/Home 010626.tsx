/*import { useState, useEffect } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./Home.module.scss";

interface BatchLine {
  id: string;
  batchCode: string;
  packingDate: string;
  elapsedDays: number;
  crates: number;
  looseUnits: number;
  totalUnits: number;
}

interface Product {
  id: string;
  code: string;
  description: string;
  alternativeDescription: string;
  category: string;
  unitsPerCrate: number;
  batches?: BatchLine[];
}

export default function Home() {
  // 🔄 LAZY INITIALIZATION: Captura segura de credenciales de la pasarela URL
  const [session] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userUrl = urlParams.get("user");
    const sectionUrl = urlParams.get("section");
    const tenantUrl = urlParams.get("tenant");

    // Si viene del Hub con parámetros válidos
    if (userUrl) {
      return {
        name: userUrl,
        section: sectionUrl || "Materia Prima",
        tenantId: tenantUrl || "moreno_plaza",
        isIdentified: true,
      };
    }

    // Si no hay URL pero hay algo guardado previamente en LocalStorage
    const savedUser = localStorage.getItem("trace_user");
    if (savedUser) {
      return {
        name: savedUser,
        section: localStorage.getItem("trace_section") || "Materia Prima",
        tenantId: localStorage.getItem("trace_tenant") || "moreno_plaza",
        isIdentified: true,
      };
    }

    // 🚨 FALLBACK: Apertura directa sin pasarela del Hub
    return {
      name: "Operario no identificado",
      section: "Sin Asignar",
      tenantId: "tracesync_global",
      isIdentified: false,
    };
  });

  const [recuentoIniciado, setRecuentoIniciado] = useState(false);
  const [fechaRecuento, setFechaRecuento] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [categoriaActiva, setCategoriaActiva] = useState<"GRANEL" | "PEQUEÑA">(
    "GRANEL",
  );
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorBackend, setErrorBackend] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(
    () => window.innerWidth > window.innerHeight,
  );

  // Persistencia limpia de estados en el dispositivo físico
  useEffect(() => {
    if (session.isIdentified) {
      localStorage.setItem("trace_user", session.name);
      localStorage.setItem("trace_section", session.section);
      localStorage.setItem("trace_tenant", session.tenantId);
    }
    // Limpiamos los parámetros de la URL para estética visual en planta
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [session]);

  // Detector de rotación física de la pantalla del móvil
  useEffect(() => {
    const handleResize = () =>
      setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📡 CONEXIÓN REAL AL BACKEND: Trae el catálogo maestro filtrado por cliente (tenantId)
  const iniciarJornadaRecuento = async () => {
    // Solicitar pantalla completa inmersiva para evitar distracciones en planta
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl
        .requestFullscreen()
        .catch(() => console.log("Modo inmersivo manual"));
    }

    setLoading(true);
    setErrorBackend(null);

    try {
      // Llamada real al puerto de tu API unificada (server.js)
      const response = await fetch(
        `http://localhost:4000/api/products?tenantId=${session.tenantId}`,
      );

      if (!response.ok) {
        throw new Error(
          `Error en el servidor de planta (Código: ${response.status})`,
        );
      }

      const data = await response.json();

      // Seteamos los datos reales traídos de tu colección de MongoDB Atlas
      setProductos(data.products || data);
      setRecuentoIniciado(true);
    } catch (err: any) {
      console.error("❌ Fallo de conexión con MongoDB Atlas:", err);
      setErrorBackend(
        "No se pudo conectar con el servidor central. Verifique que 'server.js' esté corriendo.",
      );

      // MOCKUP DE EMERGENCIA: Por si necesitas probar la UI aunque el servidor esté apagado
      const mockEmergencia: Product[] = [
        {
          id: "1",
          code: "400",
          description: "ALITAS POLLO",
          alternativeDescription: "ALITAS DE POLLO ALIÑADAS",
          category: "Frescos Pequeña",
          unitsPerCrate: 18,
          batches: [],
        },
        {
          id: "2",
          code: "401",
          description: "PECHUGA ENTERA",
          alternativeDescription: "PECHUGA ENTERA GRANEL",
          category: "Frescos Granel",
          unitsPerCrate: 10,
          batches: [],
        },
      ];
      setProductos(mockEmergencia);
      setRecuentoIniciado(true); // Permitimos avanzar para desarrollo visual
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    // Normalizamos cadenas para evitar errores de mayúsculas/minúsculas en el filtrado de Atlas
    const cat = p.category.toUpperCase();
    return categoriaActiva === "GRANEL"
      ? cat.includes("GRANEL")
      : cat.includes("PEQUEÑA");
  });

  return (
    <div className={styles.appContainer}>
      {/* 🛡️ ENCABEZADO INDUSTRIAL REQUERIDO /}
      <header className={styles.headerBar}>
        <div className={styles.brandBlock}>
          {session.isIdentified ? (
            // Logo o siglas de la empresa autenticada (ej: Moreno Plaza -> MP)
            <div className={styles.companyLogo}>
              {session.tenantId.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            // Logo genérico de la infraestructura si no está identificado
            <div className={`${styles.companyLogo} ${styles.logoGlobal}`}>
              TS
            </div>
          )}
          <div className={styles.textMeta}>
            <h1 className={styles.appTitle}>TraceSync Chamber Inventory</h1>
            <span className={styles.sectionLabel}>
              Línea: {session.section}
            </span>
          </div>
        </div>

        <div className={styles.operatorBlock}>
          <span
            className={`${styles.operatorName} ${!session.isIdentified ? styles.unidentified : ""}`}
          >
            👤 {session.name}
          </span>
        </div>
      </header>

      {/* CONTENIDO DE PANTALLA /}
      {!recuentoIniciado ? (
        <div className={styles.introContainer}>
          <div className={styles.introCard}>
            <h2 className={styles.introTitle}>Inicialización de Jornada</h2>

            <div className={styles.fieldGroup}>
              <label htmlFor="fecha-jornada">Fecha Operativa de Recuento</label>
              <input
                id="fecha-jornada"
                type="date"
                value={fechaRecuento}
                onChange={(e) => setFechaRecuento(e.target.value)}
                className={styles.dateInput}
              />
            </div>

            {errorBackend && (
              <div className={styles.errorAlert}>⚠️ {errorBackend}</div>
            )}

            <button
              onClick={iniciarJornadaRecuento}
              className={styles.startBtn}
              disabled={loading}
            >
              {loading ? "Conectando a Atlas..." : "Sincronizar e Iniciar"}
            </button>
          </div>
        </div>
      ) : (
        <main className={styles.mainContent}>
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.tabBtn} ${categoriaActiva === "GRANEL" ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva("GRANEL")}
            >
              GRANEL
            </button>
            <button
              className={`${styles.tabBtn} ${categoriaActiva === "PEQUEÑA" ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva("PEQUEÑA")}
            >
              PEQUEÑA
            </button>
          </div>

          <h2 className={styles.sectionHeader}>
            {categoriaActiva === "GRANEL"
              ? "Sección Frescos: Granel"
              : "Sección Frescos: Bandeja Pequeña"}
          </h2>

          <div
            className={`${styles.productsContainer} ${isLandscape ? styles.landscapeLayout : styles.portraitLayout}`}
          >
            {productosFiltrados.length === 0 ? (
              <p className={styles.emptyCatalog}>
                No se encontraron artículos para esta categoría en la base de
                datos.
              </p>
            ) : (
              productosFiltrados.map((prod) => (
                <ProductCard
                  key={prod.id || prod.code}
                  product={prod}
                  isLandscape={isLandscape}
                />
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}*/

/*import { useState, useEffect } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./Home.module.scss";

interface BatchLine {
  id: string;
  batchCode: string;
  packingDate: string;
  elapsedDays: number;
  crates: number;
  looseUnits: number;
  totalUnits: number;
}

interface Product {
  id: string;
  code: string;
  description: string;
  alternativeDescription: string;
  category: string;
  unitsPerCrate: number;
  batches?: BatchLine[];
}

// 🚨 DEFINICIÓN DE INTERFAZ: Sincronizada con el molde seguro de App.tsx
interface HomeProps {
  userSession?: {
    name: string;
    section: string;
    tenantId: string;
    isIdentified: boolean;
  };
}

export default function Home({ userSession }: HomeProps) {
  // 🛰️ RESPALDO DE SEGURIDAD: Si por inicialización asíncrona no viene la prop, lee LocalStorage
  const activeSession = userSession || {
    name: localStorage.getItem("trace_user") || "Operario no identificado",
    section: localStorage.getItem("trace_section") || "Materia Prima",
    tenantId: localStorage.getItem("trace_tenant") || "moreno_plaza",
    isIdentified: !!localStorage.getItem("trace_user"),
  };

  const [productos, setProductos] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(true);
  const [categoriaActiva, setCategoriaActiva] = useState<"GRANEL" | "PEQUEÑA">(
    "GRANEL",
  );

  // 📐 Hook de orientación nativo que ya tenías
  const [isLandscape, setIsLandscape] = useState<boolean>(
    window.innerWidth > window.innerHeight,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📡 CARGA DEL CATÁLOGO DIRECTO DESDE MONGO ATLAS
  useEffect(() => {
    const cargarCatalogoPlanta = async () => {
      try {
        setLoadingCatalog(true);

        const targetTenant = activeSession.tenantId;
        console.log(
          `📡 [Home.tsx] Solicitando catálogo a Atlas para el Tenant: "${targetTenant}"`,
        );

        const response = await fetch(
          `http://localhost:4000/api/products?tenant=${targetTenant}`,
        );
        const data = await response.json();

        setProductos(data);
      } catch (err) {
        console.error("❌ Error al solicitar el catálogo de cámaras:", err);
      } finally {
        setLoadingCatalog(false);
      }
    };

    cargarCatalogoPlanta();
  }, [activeSession.tenantId]); // Reacciona de inmediato si cambia el Tenant del operario

  // 🔍 FILTRADO DE CATEGORÍAS INDUSTRIALES
  const productosFiltrados = productos.filter((prod) => {
    if (categoriaActiva === "GRANEL") {
      return prod.category === "G" || prod.category === "GRANEL";
    }
    return prod.category === "P" || prod.category === "PEQUEÑA";
  });

  console.log("--------------------------------------------------");
  console.log(`📥 [Home.tsx] Renderizando vista del catálogo.`);
  console.log(`   - Operario Activo: "${activeSession.name}"`);
  console.log(`   - Tenant de Planta: "${activeSession.tenantId}"`);
  console.log(`   - Productos Encontrados Totales: ${productos.length}`);
  console.log(
    `   - Productos Visibles Filtrados: ${productosFiltrados.length}`,
  );
  console.log("--------------------------------------------------");

  return (
    <div className={styles.container}>
      {loadingCatalog ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Sincronizando maestro de artículos con planta...</p>
        </div>
      ) : (
        <div className={styles.mainCatalogContent}>
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.tabBtn} ${categoriaActiva === "GRANEL" ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva("GRANEL")}
            >
              GRANEL
            </button>
            <button
              className={`${styles.tabBtn} ${categoriaActiva === "PEQUEÑA" ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva("PEQUEÑA")}
            >
              PEQUEÑA
            </button>
          </div>

          <h3 className={styles.sectionHeader}>
            {categoriaActiva === "GRANEL"
              ? "Artículos: Frescos Granel"
              : "Artículos: Bandeja Pequeña"}
          </h3>

          <div
            className={`${styles.productsContainer} ${isLandscape ? styles.landscapeLayout : styles.portraitLayout}`}
          >
            {productosFiltrados.length === 0 ? (
              <p className={styles.emptyCatalog}>
                No se encontraron artículos cargados para este módulo.
              </p>
            ) : (
              productosFiltrados.map((prod) => (
                <ProductCard
                  key={prod.id || prod.code}
                  product={prod}
                  isLandscape={isLandscape}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}*/

{
  /*import { useState, useEffect } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./Home.module.scss";

interface BatchLine {
  id: string;
  batchCode: string;
  packingDate: string;
  elapsedDays: number;
  crates: number;
  looseUnits: number;
  totalUnits: number;
}

interface Product {
  id: string;
  code: string;
  description: string;
  alternativeDescription: string;
  category: string;
  unitsPerCrate: number;
  batches?: BatchLine[];
}

interface UserSession {
  name: string;
  section: string;
  tenantId: string;
  isIdentified: boolean;
}

interface HomeProps {
  userSession: UserSession;
  onNavigate: (
    screen: "CATALOG" | "BATCH_DETAIL",
    productId: string | null,
  ) => void;
}

export default function Home({ userSession, onNavigate }: HomeProps) {
  // 🔬 LOG DE RENDERIZADO INICIAL
  console.log("🎨 [HOME RENDERING] Componente montado/actualizado.");
  console.log("👉 userSession recibida:", userSession);
  console.log("👉 Tipo de onNavigate:", typeof onNavigate);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<string>("FRESCOS GRANEL");
  const [loading, setLoading] = useState<boolean>(true);
  const [isLandscape, setIsLandscape] = useState<boolean>(
    window.innerWidth > window.innerHeight,
  );

  // Detector de orientación de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔌 FETCH CON TRAZABILIDAD FORENSE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(
          "🛰️ [EFFECT -> FETCH START] Disparando petición HTTP a la API...",
        );
        console.log("🔗 URL Destino: http://localhost:4000/api/products");

        const response = await fetch("http://localhost:4000/api/products");

        console.log(
          "📶 [FETCH RESPONSE] Servidor respondió. Status:",
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          console.error(
            `❌ [FETCH HTTP ERROR] Código de estado no exitoso: ${response.status}`,
          );
          throw new Error(`Error en HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          "📦 [FETCH DATA RECEIVED] Array bruto descargado desde el backend:",
          data,
        );
        console.log(
          `📊 Cantidad de registros encontrados: ${Array.isArray(data) ? data.length : "No es un Array"}`,
        );

        if (Array.isArray(data) && data.length > 0) {
          console.log(
            "🔍 Estructura muestra del primer objeto de la BD:",
            data[0],
          );
        }

        // Mapeo adaptando de forma segura los identificadores primarios
        const mappedProducts: Product[] = data.map(
          (prod: any, index: number) => {
            const finalId = prod._id || prod.id;
            if (!finalId) {
              console.warn(
                `⚠️ [MAP WARNING] El producto en el índice ${index} no tiene id ni _id definido:`,
                prod,
              );
            }
            return {
              id: finalId,
              code: prod.code || "S/C",
              description: prod.description || "Sin descripción",
              alternativeDescription: prod.alternativeDescription || "",
              category: (prod.category || "").toUpperCase(),
              unitsPerCrate: prod.unitsPerCrate || 1,
              batches: prod.batches || [],
            };
          },
        );

        console.log(
          "✅ [MAP SUCCESS] Productos transformados para el estado de React:",
          mappedProducts,
        );
        setProducts(mappedProducts);
      } catch (error: any) {
        console.error(
          "❌ [CRITICAL FETCH EXCEPTION] Falló el flujo de captura de datos:",
        );
        console.error("👉 Mensaje del error:", error?.message || error);
        console.error("👉 Objeto error completo:", error);
      } finally {
        console.log(
          "🏁 [FETCH END] Finalizando estado de carga (loading = false)",
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrado en tiempo real con logs de control de salida
  const filteredProducts = products.filter((p) => {
    const match = p.category === activeCategory;
    return match;
  });

  console.log(
    `📊 [CATALOG INTELLIGENCE] Categoría activa: "${activeCategory}" | Elementos visibles a renderizar: ${filteredProducts.length}`,
  );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainCatalogContent}>
        {/* Pestañas de categorías /}
        <div className={styles.categoryTabs}>
          <button
            className={`${styles.tabBtn} ${activeCategory === "FRESCOS GRANEL" ? styles.tabActive : ""}`}
            onClick={() => setActiveCategory("FRESCOS GRANEL")}
          >
            GRANEL
          </button>
          <button
            className={`${styles.tabBtn} ${activeCategory === "FRESCOS PEQUEÑA" ? styles.tabActive : ""}`}
            onClick={() => setActiveCategory("FRESCOS PEQUEÑA")}
          >
            PEQUEÑA
          </button>
        </div>

        {/* Zona de renderizado o carga /}
        {loading ? (
          <div
            className={styles.loadingCatalog}
            style={{ color: "#00e6ff", padding: "2rem", fontWeight: "bold" }}
          >
            <span>
              🛰️ Sincronizando Cámara de Productos con Atlas... (Revisa la
              consola del navegador)
            </span>
          </div>
        ) : (
          <div
            className={`${styles.productsContainer} ${isLandscape ? styles.landscapeLayout : styles.portraitLayout}`}
          >
            {filteredProducts.length === 0 ? (
              <p className={styles.emptyCatalog}>
                No se encontraron artículos cargados en esta categoría para tu
                planta.
              </p>
            ) : (
              filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id || prod.code}
                  product={prod}
                  isLandscape={isLandscape}
                  onNavigate={(id) => {
                    console.log(
                      `🎯 [PRODUCT CARD CLICKED] Redirigiendo a lote de producto ID: ${id}`,
                    );
                    onNavigate("BATCH_DETAIL", id);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
*/
}

/*/ src/modules/home/Home.tsx
import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { CategoryFilter } from "../../components/CategoryFilter/CategoryFilter";
import styles from "./Home.module.scss";
import { useHomeState, useHomeViewModel } from "./Home.state";
import { useHomeEffects } from "./Home.effects";
import { type HomeProps } from "./Home.vm";
import { ProductService } from "../../services/product.service";

export const Home = ({ userSession, onNavigate }: HomeProps) => {
  // Estado local para orientación (esto no estaba en tu VM, lo mantenemos en UI)
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight,
  );

  // Estado y Lógica del Home (traídos de tus archivos modulados)
  const [state, setState] = useHomeState();
  const { filteredProducts, setActiveCategory, loading } = useHomeViewModel(
    state,
    setState,
  );

  // Efecto para datos
  useHomeEffects(
    userSession?.tenantId || "",
    (l) => setState((s) => ({ ...s, loading: l })),
    (p) => setState((s) => ({ ...s, products: p })),
  );

  /*useEffect(() => {
    console.log("🚀 [Home.tsx] Componente montado");
    return () => console.log("🗑️ [Home.tsx] Componente desmontado");
  }, []);/

  // Efecto de orientación
  useEffect(() => {
    const handleResize = () =>
      setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div>🛰️ Sincronizando Cámara...</div>;

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainCatalogContent}>
        <CategoryFilter
          categories={["Frescos Granel", "Frescos Pequeña"]}
          activeCategory={state.activeCategory}
          onSelect={setActiveCategory}
        />

        <div
          className={`${styles.productsContainer} ${isLandscape ? styles.landscapeLayout : styles.portraitLayout}`}
        >
          {filteredProducts.length === 0 ? (
            <p className={styles.emptyCatalog}>
              No hay artículos para esta planta.
            </p>
          ) : (
            filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id || prod.code}
                product={prod}
                isLandscape={isLandscape}
                onNavigate={(id) => onNavigate("BATCH_DETAIL", id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};*/

// src/modules/home/Home.tsx
// src/modules/home/Home.tsx
import { useEffect, useState, useCallback } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { CategoryFilter } from "../../components/CategoryFilter/CategoryFilter";
import styles from "./Home.module.scss";
import { useHomeState, useHomeViewModel } from "./Home.state";
import { useHomeEffects } from "./Home.effects";
import { type HomeProps, type Product } from "./Home.vm";

export const Home = ({ userSession, onNavigate }: HomeProps) => {
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight,
  );

  const [state, setState] = useHomeState();
  const { filteredProducts, setActiveCategory, loading } = useHomeViewModel(
    state,
    setState,
  );

  // ✅ SOLUCIÓN ESLINT: Usamos useCallback para dar estabilidad a las funciones
  // y evitar que se recreen en cada render, previniendo bucles infinitos en el useEffect.
  const handleSetLoading = useCallback(
    (l: boolean) => {
      setState((s) => ({ ...s, loading: l }));
    },
    [setState],
  );

  const handleSetProducts = useCallback(
    (p: Product[]) => {
      setState((s) => ({ ...s, products: p }));
    },
    [setState],
  );

  // Pasamos las funciones memorizadas al Effect
  useHomeEffects(
    userSession?.tenantId || "",
    handleSetLoading,
    handleSetProducts,
  );

  useEffect(() => {
    const handleResize = () =>
      setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading)
    return (
      <div className={styles.loadingCatalog}>🛰️ Sincronizando Cámara...</div>
    );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainCatalogContent}>
        <CategoryFilter
          categories={["Frescos Granel", "Frescos Pequeña"]}
          activeCategory={state.activeCategory}
          onSelect={setActiveCategory}
        />

        <div
          className={`${styles.productsContainer} ${isLandscape ? styles.landscapeLayout : styles.portraitLayout}`}
        >
          {filteredProducts.length === 0 ? (
            <p className={styles.emptyCatalog}>
              No hay artículos para esta planta.
            </p>
          ) : (
            filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id || prod.code}
                product={prod}
                isLandscape={isLandscape}
                onNavigate={(id) => onNavigate("BATCH_DETAIL", id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
