import express from "express";
import {
    addUser,
    deleteUser,
    updateUser,
    getUsers,
    getUser
} from "../controllers/user.js";

const router = express.Router();

router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
