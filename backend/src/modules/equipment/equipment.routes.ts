import { Router } from "express";
import * as equipmentController from "./equipment.controller";

const router = Router();

// Public routes
router.get("/", equipmentController.getAllEquipments);
router.get("/:slug", equipmentController.getEquipment);

export default router;
