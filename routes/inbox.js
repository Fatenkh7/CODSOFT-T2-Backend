import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById } from "../controllers/inbox.js"
import userAuth from "../middleware/userAuth.js"

router.get("/", getAll);
router.post("/add", userAuth, create);
router.get("/:ID", getById);
router.delete("/:ID", deleteById);

export default router;