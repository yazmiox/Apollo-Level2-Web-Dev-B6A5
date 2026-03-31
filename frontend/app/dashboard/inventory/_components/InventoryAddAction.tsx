"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EquipmentFormModal from "./EquipmentFormModal";
import { Category } from "@/app/types";

export default function InventoryAddAction({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex shrink-0 items-center justify-center gap-2 rounded-[8px] px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.98] bg-orange hover:bg-orange-light"
      >
        <Plus size={16} /> Action: Add Equipment
      </button>

      {isOpen && (
        <EquipmentFormModal
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
          onClose={() => setIsOpen(false)}
          categories={categories}
        />
      )}
    </>
  );
}
