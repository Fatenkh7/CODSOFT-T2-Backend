import express from "express";
const router = express.Router();
import { create, deleteById, getAll, getById } from "../controllers/inbox.js"

router.get("/", getAll);
router.post("/add", create);
router.get("/:ID", getById);
router.delete("/:ID", deleteById);

export default router;