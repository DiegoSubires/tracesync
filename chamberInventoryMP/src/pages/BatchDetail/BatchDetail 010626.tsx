import { useState } from "react";
import { BatchRow } from "../../components/BatchRow/BatchRow";
import { useBatchDetailState } from "./BatchDetail.state";
import { useBatchDetailEffects } from "./BatchDetail.effects";
import { type BatchLine } from "../../components/BatchRow/BatchRow.vm";
import { type BatchDetailProps, Empty_Line } from "./BatchDetail.vm";
import styles from "./BatchDetail.module.scss";

export default function BatchDetail({
  productId,
  tenantId,
  onBack,
}: BatchDetailProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const state = useBatchDetailState(null);

  useBatchDetailEffects({
    productId,
    tenantId,
    setLoading,
    hydrateState: state.hydrateState,
  });

  console.log(
    `📊 [BatchDetail] Producto ID: ${productId} | Total actual recalculado: ${state.grandTotalUnits} unds`,
  );

  if (loading)
    return <div className={styles.loading}>Cargando datos de planta...</div>;
  if (!state.product)
    return <div className={styles.loading}>Artículo no localizado.</div>;

  const handleOnBack = () => {
    console.log(
      "💾 [BatchDetail] Saliendo de BatchDetail. Unidades finales detectadas:",
      state.grandTotalUnits,
    );
    // Aquí es donde deberías disparar un: await ProductService.saveBatches(productId, state.batchLines);
    onBack();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.focusedHeader}>
        <button
          type="button"
          onClick={handleOnBack}
          className={styles.backButton}
        >
          ⬅ Volver al Catálogo
        </button>
        <span className={styles.productCodeHeader}>{state.product.code}</span>
      </div>

      <div className={styles.productMainCard}>
        <h2 className={styles.title}>
          {state.product.alternativeDescription || state.product.description}
        </h2>

        <div className={styles.mainLayoutGrid}>
          {/* Listado de Lotes Existentes y Creador unidos en una sola sección limpia */}
          <div className={styles.batchesSection}>
            {state.batchLines.map((line, index) => (
              <BatchRow
                key={line.id}
                linea={line}
                index={index}
                unitsPerCrate={state.product!.unitsPerCrate}
                onChangeField={(
                  id: string,
                  field: keyof BatchLine,
                  value: string,
                ) =>
                  state.updateField(
                    id,
                    field,
                    value,
                    state.product!.unitsPerCrate,
                  )
                }
                onRemove={(id: string) => state.removeBatchRow(id)}
              />
            ))}

            <BatchRow
              isCreator
              onAdd={state.addBatchRow}
              linea={Empty_Line}
              index={state.batchLines.length}
              onChangeField={() => {}}
              onRemove={() => {}}
            />
          </div>
        </div>

        <div className={styles.formFooterOnlyTotals}>
          <span className={styles.totalLabel}>Total Producto:</span>
          <strong className={styles.totalValue}>
            {state.grandTotalUnits} unds
          </strong>
        </div>
      </div>
    </div>
  );
}
