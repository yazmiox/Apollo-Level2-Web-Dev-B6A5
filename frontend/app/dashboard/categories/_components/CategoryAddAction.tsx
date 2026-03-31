"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryFormModal from "./CategoryFormModal";

export default function CategoryAddAction() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex shrink-0 items-center justify-center gap-2 rounded-[8px] px-4 py-2 text-sm font-bold text-white transition-all active:scale-[0.98] bg-stone-900 hover:bg-stone-800"
      >
        <Plus size={16} /> Action: Add Category
      </button>

      {isOpen && (
        <CategoryFormModal
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
