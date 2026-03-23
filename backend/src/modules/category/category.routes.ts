import { Router } from "express";
import * as categoryController from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import { authenticate } from "../../middlewares/auth";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategory);

// Protected routes
router.post("/", authenticate, validateRole("admin"), validateRequest(createCategorySchema), categoryController.createCategory);
router.patch("/:id", authenticate, validateRole("admin"), validateRequest(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", authenticate, validateRole("admin"), categoryController.deleteCategory);

export default router;