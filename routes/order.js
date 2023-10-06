import express from "express"
import { create, deleteById, getAll, getById, update } from "../controllers/order.js";
const router = express.Router();
import userAuth from "../middleware/userAuth.js"

router.get("/", getAll)
router.get("/:ID", userAuth, getById)
router.post("/add", userAuth, create)
router.put("/:ID", userAuth, update)
router.delete("/:ID", deleteById)

export default router;