import { Router } from "express";
import * as equipmentController from "./equipment.controller";

const router = Router();

// Public routes
router.get("/", equipmentController.getAllEquipments);

export default router;
