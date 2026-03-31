import { z } from "zod";
import { EquipmentCondition, EquipmentStatus } from "../../generated/prisma/enums";

export const createEquipmentSchema = z.object({
    name: z.string({
        error: "Name is required",
    }).min(2, "Name must be at least 2 characters").max(100),

    slug: z.string({
        error: "Slug is required",
    }).min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),

    description: z.string({
        error: "Description is required",
    }).min(10, "Description must be at least 10 characters"),

    categoryId: z.string({
        error: "Category ID is required",
    }),

    brand: z.string({
        error: "Brand is required",
    }).min(2, "Brand must be at least 2 characters"),
    modelName: z.string({
        error: "Model name is required",
    }).min(2, "Model name must be at least 2 characters"),
    location: z.string({
        error: "Location is required",
    }).min(2, "Location must be at least 2 characters"),
    imageKey: z.string("Invalid image URL"),
    condition: z.enum(EquipmentCondition).default("GOOD"),
    status: z.enum(EquipmentStatus).default("AVAILABLE"),
    rentalRate: z.number({
        error: "Rental rate is required",
    }).positive("Rental rate must be positive"),
    includedItems: z.array(z.string()).min(1, "Included items are required"),
    specifications: z.record(z.string(), z.any()).refine(
        (data) => Object.keys(data).length > 0,
        "Specifications must contain at least one property"
    ),
    isFeatured: z.boolean().default(false),
})

export const updateEquipmentSchema = createEquipmentSchema.partial();

export const createEquipmentImageUploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    contentType: z.string().min(1, "Content type is required"),
    size: z.number().positive("File size must be greater than 0"),
});

export type CreateEquipmentImageUploadInput = z.infer<typeof createEquipmentImageUploadSchema>;
export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
