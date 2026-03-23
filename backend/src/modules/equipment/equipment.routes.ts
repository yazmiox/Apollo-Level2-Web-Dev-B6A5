import { Router } from "express";
import * as equipmentController from "./equipment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createEquipmentSchema, updateEquipmentSchema } from "./equipment.schema";
import { authenticate } from "../../middlewares/auth";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// Public routes
router.get("/", equipmentController.getAllEquipments);
router.get("/:slug", equipmentController.getEquipment);

// Protected routes (Admin only)
router.post("/", authenticate, validateRole("admin"), validateRequest(createEquipmentSchema), equipmentController.createEquipment);
router.patch("/:id", authenticate, validateRole("admin"), validateRequest(updateEquipmentSchema), equipmentController.updateEquipment);

export default router;
