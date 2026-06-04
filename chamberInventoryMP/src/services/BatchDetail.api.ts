import { type ProductDetail } from "./BatchDetail.vm";
import { mapApiToProductDetail } from "./BatchDetail.mapper";
import { type BatchLine } from "../../components/BatchRow/BatchRow.vm";

export async function fetchProductById(
  productId: string,
): Promise<ProductDetail | null> {
  const response = await fetch("http://localhost:4000/api/products");
  if (!response.ok) throw new Error(`API error: ${response.statusText}`);

  const rawData = (await response.json()) as
    | Record<string, unknown>
    | Record<string, unknown>[];
  return mapApiToProductDetail(rawData, productId);
}

export async function saveProductBatches(
  productId: string,
  batches: BatchLine[],
): Promise<boolean> {
  console.log(`💾 [API] Saving batches for ${productId}:`, batches);
  return true;
}
