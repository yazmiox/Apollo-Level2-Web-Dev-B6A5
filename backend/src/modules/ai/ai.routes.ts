import { Router } from "express";
import * as aiController from "./ai.controller";

const router = Router();

router.get("/suggestions", aiController.getSuggestions);
router.post("/chat", aiController.chatWithAssistant);

export default router;
