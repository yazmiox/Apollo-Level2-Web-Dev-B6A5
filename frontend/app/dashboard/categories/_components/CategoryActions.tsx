"use client";

import { deleteCategory } from "@/app/actions/category";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryFormModal from "./CategoryFormModal";
import { Category } from "@/app/types";

export default function CategoryActions({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This might affect items in this category.")) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting category...");

    try {

      const response = await deleteCategory(id);
      if (!response.success) throw new Error(response.message || "Failed to delete category");

      toast.success("Category deleted successfully", { id: toastId });
      router.refresh();

    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.message || "Could not delete category", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          title="Edit"
          className="flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          onClick={() => handleDelete(category.id)}
          disabled={isDeleting}
          title="Delete"
          className="flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {isEditing && (
        <CategoryFormModal
          initialData={category}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
