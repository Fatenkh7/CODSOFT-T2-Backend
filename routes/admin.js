import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, loginAdmin, update } from "../controllers/admin.js"
import adminAuth from "../middleware/adminAuth.js"

router.get("/", getAll);
router.post("/add", create);
router.post("/login", loginAdmin)
router.get("/:ID", adminAuth, getById);
router.put("/:ID", adminAuth, update);
router.delete("/:ID", adminAuth, deleteById);

export default router;