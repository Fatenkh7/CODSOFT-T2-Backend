import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, update } from "../controllers/product.js"
import imageHandel from "../middleware/imageHandel.js";
import userAuth from "../middleware/userAuth.js"

router.get("/", userAuth, getAll);
router.post("/add", imageHandel, create);
router.get("/:ID", getById);
router.put("/:ID", userAuth, imageHandel, update)
router.delete("/:ID", deleteById)

export default router;