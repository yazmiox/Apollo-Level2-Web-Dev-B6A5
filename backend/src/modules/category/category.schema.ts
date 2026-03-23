import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string({
        error: "Name is required",
    }).min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),

    slug: z.string({
        error: "Slug is required",
    }).min(2, "Slug must be at least 2 characters").max(50, "Slug cannot exceed 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),

    description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).max(50).optional(),
    slug: z.string().min(2).max(50)
        .regex(/^[a-z0-0-]+$/).optional(),
    description: z.string().max(300).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
