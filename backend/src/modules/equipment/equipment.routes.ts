import { Router } from "express";
import * as equipmentController from "./equipment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createEquipmentImageUploadSchema, createEquipmentSchema, updateEquipmentSchema } from "./equipment.schema";
import { authenticate } from "../../middlewares/auth";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// Public routes
router.get("/", equipmentController.getAllEquipments);
router.get("/:slug", equipmentController.getEquipment);

// Vendor routes — manage own equipment
router.get("/vendor/me", authenticate, validateRole("vendor"), equipmentController.getMyEquipments);

// Protected routes (Admin & Vendor can manage equipment)
router.post("/upload-url", authenticate, validateRole("admin", "vendor"), validateRequest(createEquipmentImageUploadSchema), equipmentController.createEquipmentImageUploadUrl);
router.post("/", authenticate, validateRole("admin", "vendor"), validateRequest(createEquipmentSchema), equipmentController.createEquipment);
router.patch("/:id", authenticate, validateRole("admin", "vendor"), validateRequest(updateEquipmentSchema), equipmentController.updateEquipment);
router.delete("/:id", authenticate, validateRole("admin", "vendor"), equipmentController.deleteEquipment);

export default router;
