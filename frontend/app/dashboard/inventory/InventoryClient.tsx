"use client";

import { deleteCategory } from "@/app/actions/category";
import { deleteEquipment } from "@/app/actions/equipment";
import { Edit2, Loader2, Package, Plus, Search, Tags, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CategoryFormModal from "../_components/CategoryFormModal";
import EquipmentFormModal from "../_components/EquipmentFormModal";

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemsCount: number;
}

type Equipment = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  modelName: string;
  description: string;
  location: string;
  imageKey: string;
  imageUrl?: string;
  condition: string;
  status: string;
  rentalRate: number;
  includedItems: string[];
  specifications: any;
  categoryId: string;
  category?: Category;
}

interface InventoryClientProps {
  initialEquipments: Equipment[];
  initialCategories: Category[];
}

export default function InventoryClient({ initialEquipments, initialCategories }: InventoryClientProps) {
  const [activeTab, setActiveTab] = useState<"EQUIPMENT" | "CATEGORIES">("EQUIPMENT");
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredInventory = equipments.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategorySuccess = (updatedItem: Category) => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === updatedItem.id);
      if (index !== -1) {
        return prev.map((c) => (c.id === updatedItem.id ? { ...c, ...updatedItem } : c));
      }
      return [...prev, updatedItem];
    });
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;

    const toastId = toast.loading("Deleting equipment...");
    try {
      const res = await deleteEquipment(id);
      if (res.success) {
        setEquipments(equipments.filter(e => e.id !== id));
        toast.success("Equipment deleted", { id: toastId });
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete", { id: toastId });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This might affect items in this category.")) return;

    setDeletingId(id);
    const toastId = toast.loading("Deleting category...");

    try {
      const response = await deleteCategory(id);
      if (response.success) {
        setCategories(categories.filter((c) => c.id !== id));
        toast.success("Category deleted successfully", { id: toastId });
      } else {
        throw new Error(response.message || "Failed to delete category");
      }
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.message || "Could not delete category", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEquipmentSuccess = (updatedItem: Equipment) => {
    setEquipments((prev) => {
      const index = prev.findIndex((e) => e.id === updatedItem.id);
      if (index !== -1) {
        // Update existing item
        const newEquipments = [...prev];
        newEquipments[index] = { ...newEquipments[index], ...updatedItem };
        return newEquipments;
      }
      // Add new item to the beginning
      return [updatedItem, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            Add, update, or remove equipment and categories from your catalog.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[8px] bg-[#f9f8f6] p-1 border border-[#e0dbd3]">
          <button
            onClick={() => setActiveTab("EQUIPMENT")}
            className={`flex items-center gap-2 rounded-[6px] px-4 py-2 text-sm font-bold transition-all ${activeTab === "EQUIPMENT" ? "bg-white shadow-sm border border-[#e0dbd3] text-[#111]" : "text-[#777] hover:text-[#111]"}`}
          >
            <Package size={16} />
            Equipment
          </button>
          <button
            onClick={() => setActiveTab("CATEGORIES")}
            className={`flex items-center gap-2 rounded-[6px] px-4 py-2 text-sm font-bold transition-all ${activeTab === "CATEGORIES" ? "bg-white shadow-sm border border-[#e0dbd3] text-[#111]" : "text-[#777] hover:text-[#111]"}`}
          >
            <Tags size={16} />
            Categories
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex gap-4 items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full rounded-[8px] border border-[#e0dbd3] bg-white px-4 py-2 pl-9 text-sm text-[#111] outline-none transition-all focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]/30"
            />
          </div>

          <button
            onClick={() => activeTab === "EQUIPMENT" ? setIsEquipModalOpen(true) : setIsCategoryModalOpen(true)}
            className={`flex shrink-0 items-center justify-center gap-2 rounded-[8px] px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.98] ${activeTab === "EQUIPMENT" ? "bg-[#e8612e] hover:bg-[#f07248]" : "bg-[#111] hover:bg-[#333]"}`}
          >
            <Plus size={16} /> Action: Add {activeTab === "EQUIPMENT" ? "Equipment" : "Category"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#555] whitespace-nowrap">
            <thead className="border-b border-[#f0ece5] bg-[#f9f8f6] text-xs font-bold uppercase tracking-wider text-[#888]">
              {activeTab === "EQUIPMENT" ? (
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Equipment Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {activeTab === "EQUIPMENT" ? (
                filteredInventory.length === 0 ? (
                  <tr><td colSpan={6} className="py-20 text-center text-sm font-semibold text-[#555]">No equipment matches search.</td></tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f8f6] transition-colors group">
                      <td className="px-6 py-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-[6px] border border-[#e0dbd3] bg-[#f4f1ed]">
                          {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#111]">{item.name}</td>
                      <td className="px-6 py-4">{item.category?.name || "Uncategorized"}</td>
                      <td className="px-6 py-4 font-medium text-[#111]">
                        {CONDITION_LABELS[item.condition] ?? item.condition}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide border ${item.status === "AVAILABLE" ? "bg-green-500/10 text-green-700 border-green-500/20" :
                          item.status === "MAINTENANCE" ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" :
                            "bg-slate-500/10 text-slate-700 border-slate-500/20"
                          }`}>
                          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingEquipment(item)} title="Edit" className="rounded-md border border-[#e0dbd3] bg-white p-1.5 text-[#888] hover:text-[#111] hover:bg-[#f4f1ed] transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteEquipment(item.id)} title="Delete" className="rounded-md border border-[#e0dbd3] bg-white p-1.5 text-[#888] hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                filteredCategories.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-sm font-semibold text-[#555]">No categories match search.</td></tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#f9f8f6] transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#111]">{cat.name}</td>
                      <td className="px-6 py-4">{cat.description}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingCategory(cat)} title="Edit" className="flex items-center gap-1 rounded-md border border-[#e0dbd3] bg-white p-1.5 text-[#888] hover:text-[#111] hover:bg-[#f4f1ed] transition-colors">
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={deletingId === cat.id}
                            title="Delete"
                            className="flex items-center gap-1 rounded-md border border-[#e0dbd3] bg-white p-1.5 text-[#888] hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                          >
                            {deletingId === cat.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            {deletingId === cat.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Equipment Modal ── */}
      {(isEquipModalOpen || editingEquipment) && (
        <EquipmentFormModal
          initialData={editingEquipment}
          onSuccess={handleEquipmentSuccess}
          onClose={() => { setIsEquipModalOpen(false); setEditingEquipment(null); }}
          categories={categories}
        />
      )}

      {/* ── Add/Edit Category Modal ── */}
      {(isCategoryModalOpen || editingCategory) && (
        <CategoryFormModal
          initialData={editingCategory}
          onSuccess={handleCategorySuccess}
          onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        />
      )}
    </div>
  );
}
