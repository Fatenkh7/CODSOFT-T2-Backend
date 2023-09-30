import express from "express"
import { create, deleteById, getAll, getById, update } from "../controllers/order.js";
const router = express.Router();

router.get("/", getAll)
router.get("/:ID", getById)
router.post("/add", create)
router.put("/:ID", update)
router.delete("/:ID", deleteById)

export default router;