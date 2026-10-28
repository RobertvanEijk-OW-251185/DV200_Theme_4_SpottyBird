import { Router } from "express";
import { getEnclosures } from "../controllers/enclosureController.js";

const router = Router();

router.get("/", getEnclosures);

export default router;
