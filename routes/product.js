import express from "express";
const router = express.Router();
import { create, getAll, getById, update } from "../controllers/product.js"

router.get("/", getAll);
router.post("/add", create);
router.get("/:ID", getById);
router.put("/:ID", update)

export default router;