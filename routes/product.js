import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, update } from "../controllers/product.js"
import imageHandel from "../middleware/imageHandel.js";

router.get("/", getAll);
router.post("/add", imageHandel, create);
router.get("/:ID", getById);
router.put("/:ID", imageHandel, update)
router.delete("/:ID", deleteById)

export default router;