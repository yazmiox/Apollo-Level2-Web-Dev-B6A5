import InventoryClient from "./InventoryClient";

export default async function AdminInventoryPage() {
  const categoriesRes = { success: true, data: [] }
  const equipmentsRes = { success: true, data: [] }

  const categories = categoriesRes?.success && Array.isArray(categoriesRes.data)
    ? categoriesRes.data
    : [];

  const equipments = equipmentsRes?.success && Array.isArray(equipmentsRes.data)
    ? equipmentsRes.data
    : [];

  return (
    <InventoryClient
      initialEquipments={equipments}
      initialCategories={categories}
    />
  );
}
