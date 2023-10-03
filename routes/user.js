import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById, loginUser, update } from "../controllers/user.js"
import userAuth from "../middleware/userAuth.js"

router.get("/", getAll);
router.post("/add", create);
router.post("/login", userAuth, loginUser)
router.get("/:ID", getById);
router.put("/:ID", userAuth, update);
router.delete("/:ID", userAuth, deleteById);

export default router;