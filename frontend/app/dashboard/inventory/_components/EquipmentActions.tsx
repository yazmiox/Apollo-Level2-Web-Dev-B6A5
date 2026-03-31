"use client";

import { deleteEquipment } from "@/app/actions/equipment";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EquipmentFormModal from "./EquipmentFormModal";

interface EquipmentActionsProps {
  equipment: any;
  categories: any[];
}

export default function EquipmentActions({ equipment, categories }: EquipmentActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;

    const toastId = toast.loading("Deleting equipment...");
    try {
      const res = await deleteEquipment(id);
      if (res.success) {
        toast.success("Equipment deleted", { id: toastId });
        router.refresh();
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete", { id: toastId });
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          title="Edit"
          className="rounded-md border border-stone-200 bg-white p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleDelete(equipment.id)}
          title="Delete"
          className="rounded-md border border-stone-200 bg-white p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isEditing && (
        <EquipmentFormModal
          initialData={equipment}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
          onClose={() => setIsEditing(false)}
          categories={categories}
        />
      )}
    </>
  );
}
