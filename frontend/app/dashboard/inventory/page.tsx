import { getAllCategories } from "@/app/actions/category";
import { getAllEquipments } from "@/app/actions/equipment";
import InventoryClient from "./InventoryClient";

export default async function AdminInventoryPage() {
  const [categoriesRes, equipmentsRes] = await Promise.all([
    getAllCategories(),
    getAllEquipments()
  ]);

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
