import { Router } from "express";
import * as categoryController from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);

// Admin only — vendors don't manage categories
router.post("/", validateRole("admin"), validateRequest(createCategorySchema), categoryController.createCategory);
router.patch("/:id", validateRole("admin"), validateRequest(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", validateRole("admin"), categoryController.deleteCategory);

export default router;