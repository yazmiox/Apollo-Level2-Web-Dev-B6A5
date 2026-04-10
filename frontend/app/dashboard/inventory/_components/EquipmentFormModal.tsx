"use client";

import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createEquipment, getUploadUrl, updateEquipment } from "@/app/actions/equipment";
import { Category, Equipment } from "@/app/types";

interface Specification {
  id: string;
  key: string;
  value: string;
}

interface EquipmentFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  initialData?: Equipment;
}

export default function EquipmentFormModal({ onClose, onSuccess, categories, initialData }: EquipmentFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getValidationClass = (field: string) => {
    return validationErrors[field]
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-[#e0dbd3] focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]";
  };

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      if (initialData.imageUrl) {
        setPreview(initialData.imageUrl);
      }
      if (initialData.specifications) {
        const specs = Object.entries(initialData.specifications).map(([key, value]) => ({
          id: Math.random().toString(36).substring(2, 9),
          key,
          value: value as string,
        }));
        setSpecifications(specs);
      } else {
        setSpecifications([{ id: "initial", key: "", value: "" }]);
      }
    } else {
      setSpecifications([{ id: "initial", key: "", value: "" }]);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview && !preview.startsWith("http")) {
        URL.revokeObjectURL(preview);
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedFile(file);
    }
  };

  const removePreview = () => {
    if (preview && !preview.startsWith("http")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
  };

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { id: Math.random().toString(36).substring(2, 9), key: "", value: "" }]);
  };

  const updateSpecification = (id: string, field: "key" | "value", newValue: string) => {
    setSpecifications(prev => prev.map(spec => spec.id === id ? { ...spec, [field]: newValue } : spec));
  };

  const removeSpecification = (id: string) => {
    setSpecifications(prev => prev.filter(spec => spec.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const needsImageUpload = !!selectedFile;
    const hasExistingImage = !!initialData?.imageKey && !selectedFile;

    if (!needsImageUpload && !hasExistingImage && !isEditMode) {
      toast.error("Please select an image first");
      return;
    }

    const toastId = toast.loading(isEditMode ? "Updating equipment..." : "Adding equipment...");

    try {
      setIsSubmitting(true);
      setValidationErrors({});
      let finalImageKey = initialData?.imageKey || "";

      let uploadUrlToUse = "";

      if (needsImageUpload) {
        toast.loading(isEditMode ? "Updating equipment..." : "Adding equipment...", {
          id: toastId,
          description: "Getting upload URL..."
        });

        const presignedRes = await getUploadUrl({
          fileName: selectedFile!.name,
          contentType: selectedFile!.type,
          size: selectedFile!.size,
        });

        if (!presignedRes.success) throw new Error(presignedRes.message || "Failed to get upload URL");
        const { key, uploadUrl } = (presignedRes as any).data;
        finalImageKey = key;
        uploadUrlToUse = uploadUrl;
      }

      toast.loading(isEditMode ? "Updating equipment..." : "Adding equipment...", {
        id: toastId,
        description: isEditMode ? "Saving changes..." : "Finalizing details..."
      });

      const formData = new FormData(form);
      const formattedSpecs = specifications.reduce((acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const includedItemsRaw = formData.get("includedItems") as string;
      const includedItems = includedItemsRaw ? includedItemsRaw.split(",").map(item => item.trim()).filter(Boolean) : [];

      const equipmentData = {
        name: formData.get("name"),
        description: formData.get("description"),
        categoryId: formData.get("categoryId"),
        brand: formData.get("brand"),
        modelName: formData.get("modelName"),
        location: formData.get("location"),
        condition: formData.get("condition"),
        status: formData.get("status"),
        isFeatured: formData.get("isFeatured") === "on",
        rentalRate: parseFloat(formData.get("rentalRate") as string),
        includedItems: includedItems,
        specifications: formattedSpecs,
        imageKey: finalImageKey,
      };

      const res = isEditMode
        ? await updateEquipment(initialData.id, equipmentData)
        : await createEquipment(equipmentData);

      if (!res.success) {
        if ((res as any).validationErrors) setValidationErrors((res as any).validationErrors);
        throw new Error(res.message || "Failed to save equipment");
      }

      if (needsImageUpload && uploadUrlToUse) {
        toast.loading(isEditMode ? "Updating equipment..." : "Adding equipment...", {
          id: toastId,
          description: "Uploading image..."
        });

        const uploadRes = await fetch(uploadUrlToUse, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile!.type },
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
      }

      toast.success(isEditMode ? "Equipment updated!" : "Equipment added!", { id: toastId, description: "" });

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(isEditMode ? "Update failed" : "Addition failed", {
        id: toastId,
        description: err.message || "Something went wrong"
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#111]/40 backdrop-blur-sm p-4 sm:p-8 isolate scrollbar-hide">
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 h-fit">
        <div className="mb-8 flex items-center justify-between border-b border-[#f0ece5] pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              {isEditMode ? "Edit Equipment" : "Add Equipment"}
            </h3>
            <p className="text-xs text-[#888]">
              {isEditMode ? "Update details for this item." : "Create a new listing in your catalog."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[#aaa] hover:bg-[#f4f1ed] hover:text-[#111] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Image Upload Area */}
          <div className="space-y-3">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

            {!preview ? (
              <label onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors hover:bg-[#e8612e]/5 ${validationErrors.imageKey ? "border-red-500 bg-red-50/30" : "border-[#e0dbd3] hover:border-[#e8612e]/40 bg-[#f9f8f6]"}`}>
                <ImageIcon size={32} className={`mb-2 ${validationErrors.imageKey ? "text-red-400" : "text-[#ccc]"}`} />
                <p className="text-sm font-bold text-[#111]">Click to upload preview image</p>
                <p className="text-xs text-[#888]">PNG, JPG up to 5MB (Single image)</p>
              </label>
            ) : (
              <div className="relative group overflow-hidden rounded-xl border border-[#e0dbd3] bg-[#f9f8f6]">
                <img src={preview} alt="preview" className="h-[240px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#111] shadow-xl hover:bg-white/90 active:scale-95 transition-all">
                    <ImageIcon size={14} /> Change Image
                  </button>
                  <button type="button" onClick={removePreview} className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xl hover:bg-red-700 active:scale-95 transition-all">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            )}
            {validationErrors.imageKey && (
              <p className="text-[11px] font-medium text-red-500 px-1">{validationErrors.imageKey[0]}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Name</label>
              <input name="name" type="text" defaultValue={initialData?.name} required placeholder="Sony FX6..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("name")}`} />
              {validationErrors.name && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.name[0]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Category</label>
              <select name="categoryId" defaultValue={initialData?.categoryId} className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("categoryId")}`}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {validationErrors.categoryId && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.categoryId[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Brand</label>
              <input name="brand" type="text" defaultValue={initialData?.brand} placeholder="Sony, Canon..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("brand")}`} />
              {validationErrors.brand && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.brand[0]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Model</label>
              <input name="modelName" type="text" defaultValue={initialData?.modelName} placeholder="FX6, EOS R5..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("modelName")}`} />
              {validationErrors.modelName && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.modelName[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Long Description</label>
              <textarea name="description" defaultValue={initialData?.description} rows={4} placeholder="Detailed equipment information..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("description")}`}></textarea>
              {validationErrors.description && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.description[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Pickup Location</label>
              <input name="location" type="text" defaultValue={initialData?.location} placeholder="Studio A, Storage B..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("location")}`} />
              {validationErrors.location && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.location[0]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Condition</label>
              <select name="condition" defaultValue={initialData?.condition} className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("condition")}`}>
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
              {validationErrors.condition && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.condition[0]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Status</label>
              <select name="status" defaultValue={initialData?.status} className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("status")}`}>
                <option value="AVAILABLE">Available</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="DAMAGED">Damaged</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              {validationErrors.status && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.status[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 justify-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  defaultChecked={initialData?.isFeatured}
                  className="h-4 w-4 rounded border-[#e0dbd3] accent-[#e8612e] focus:ring-[#e8612e] transition-all"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Featured Listing</span>
              </label>
              <p className="text-[10px] text-[#aaa] mt-[-2px]">Highlight this item on the storefront.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Rental Rate ($ / Day)</label>
              <input name="rentalRate" type="number" defaultValue={initialData?.rentalRate} min="0" step="0.01" placeholder="85.00" required className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("rentalRate")}`} />
              {validationErrors.rentalRate && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.rentalRate[0]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">What's Included (Comma separated)</label>
              <input name="includedItems" type="text" defaultValue={initialData?.includedItems?.join(", ")} placeholder="Battery, Charger, SD Card..." className={`rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("includedItems")}`} />
              {validationErrors.includedItems && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.includedItems[0]}</p>
              )}
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Technical Specifications</label>
              <button type="button" onClick={addSpecification} className="flex items-center gap-1 text-[11px] font-bold text-[#e8612e] hover:text-[#f07248] transition-colors">
                <Plus size={14} /> Add Specification
              </button>
            </div>

            <div className="grid gap-3">
              {validationErrors.specifications && (
                <p className="text-[11px] font-medium text-red-500">{validationErrors.specifications[0]}</p>
              )}
              {specifications.map((spec) => (
                <div key={spec.id} className="flex gap-2 animate-in slide-in-from-top-1 duration-200">
                  <input type="text" placeholder="Title (e.g. Sensor)" value={spec.key} onChange={(e) => updateSpecification(spec.id, "key", e.target.value)} className={`flex-1 rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("specifications")}`} />
                  <input type="text" placeholder="Value (e.g. Micro P3)" value={spec.value} onChange={(e) => updateSpecification(spec.id, "value", e.target.value)} className={`flex-1 rounded-[7px] border px-3 py-2 text-sm text-[#111] outline-none transition-all ${getValidationClass("specifications")}`} />
                  <button type="button" onClick={() => removeSpecification(spec.id)} className={`rounded-md border p-2 transition-all ${validationErrors.specifications ? "border-red-500 text-red-500 hover:bg-red-50" : "border-[#e0dbd3] text-[#aaa] hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {specifications.length === 0 && (
                <p className={`text-xs italic text-center py-6 border border-dashed rounded-xl ${validationErrors.specifications ? "border-red-500 bg-red-50/30 text-red-500" : "border-[#e0dbd3] bg-[#f9f8f6] text-[#aaa]"}`}>
                  No technical specifications added yet.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#f0ece5]">
            <button type="submit" disabled={isSubmitting} className="group w-full rounded-[8px] bg-[#e8612e] py-3.5 text-sm font-bold text-white hover:bg-[#f07248] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={18} /> {isEditMode ? "Updating..." : "Saving..."}</>
              ) : (
                isEditMode ? "Save Changes" : "Save Equipment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
