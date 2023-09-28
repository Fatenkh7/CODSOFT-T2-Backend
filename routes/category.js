import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, update } from "../controllers/category.js"

router.get("/", getAll);
router.post("/add", create);
router.get("/:ID", getById);
router.put("/:ID", update);
router.delete("/:ID", deleteById);

export default router;