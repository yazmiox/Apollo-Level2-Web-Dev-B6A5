import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import * as categoryController from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategory);

// Protected routes
router.post("/", validateRequest(createCategorySchema), categoryController.createCategory);
router.patch("/:id", validateRequest(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;