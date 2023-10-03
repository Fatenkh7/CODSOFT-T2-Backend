import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, update } from "../controllers/category.js"
import userAuth from "../middleware/userAuth.js"

router.get("/", userAuth, getAll);
router.post("/add", create);
router.get("/:ID", userAuth, getById);
router.put("/:ID", update);
router.delete("/:ID", deleteById);

export default router;