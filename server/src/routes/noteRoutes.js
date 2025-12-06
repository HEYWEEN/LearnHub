import express from "express";
import {
  createNote,
  deleteNote,
  listNotes,
  saveNote,
  updateNote,
} from "../controllers/noteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createNote);

router.get("/", verifyToken, listNotes);

router.delete("/:noteId", verifyToken, deleteNote);

router.post("/:noteId", verifyToken, updateNote);

//创建与更新课程笔记
//一个课程对应一个笔记
//上面的api则是针对单个笔记的增删改查，并且一个课程可以有多个笔记
router.post("/:courseId/:lessonId", verifyToken, saveNote);

export default router;
