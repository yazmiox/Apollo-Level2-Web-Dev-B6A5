"use client";

import { useState } from "react";
import { X, Loader2, Tags } from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/app/actions/category";

interface CategoryFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function CategoryFormModal({ onClose, onSuccess, initialData }: CategoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const toastId = toast.loading(isEditMode ? "Updating category..." : "Creating category...");

    try {
      setIsSubmitting(true);
      const res = isEditMode
        ? await updateCategory(initialData.id, data)
        : await createCategory(data);

      if (!res.success) throw new Error(res.message || "Something went wrong");

      toast.success(isEditMode ? "Category updated!" : "Category created!", { id: toastId });
      onSuccess();
      onClose();

    } catch (err: any) {
      console.error("Category Error:", err);
      toast.error(isEditMode ? "Update failed" : "Creation failed", {
        id: toastId,
        description: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111]/40 backdrop-blur-sm p-4 isolate">
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="mb-6 flex items-center justify-between border-b border-[#f0ece5] pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#e8612e]/10 p-2 text-[#e8612e]">
              <Tags size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                {isEditMode ? "Edit Category" : "Add Category"}
              </h3>
              <p className="text-xs text-[#888]">
                {isEditMode ? "Update existing category details." : "Create a new equipment grouping."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[#aaa] hover:bg-[#f4f1ed] hover:text-[#111] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Category Name</label>
            <input
              name="name"
              defaultValue={initialData?.name}
              type="text"
              required
              placeholder="e.g. Audio, Drones"
              className="rounded-[7px] border border-[#e0dbd3] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Description</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              rows={3}
              placeholder="Brief description of this category..."
              className="rounded-[7px] border border-[#e0dbd3] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e] transition-all"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[8px] border border-[#e0dbd3] bg-white py-2.5 text-sm font-bold text-[#555] hover:bg-[#f9f8f6] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] rounded-[8px] bg-[#111] py-2.5 text-sm font-bold text-white hover:bg-[#333] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={18} /> {isEditMode ? "Saving..." : "Creating..."}</>
              ) : (
                isEditMode ? "Save Changes" : "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
