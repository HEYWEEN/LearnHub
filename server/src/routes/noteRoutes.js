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

router.get("/", verifyToken, listNotes);

router.post("/", verifyToken, createNote);

router.delete("/:noteId", verifyToken, deleteNote);

router.post("/:noteId", verifyToken, updateNote);

//创建与更新课程笔记
//一个课程对应一个笔记
//上面的api则是针对单个笔记的增删改
router.post("/:courseId/:lessonId", verifyToken, saveNote);

export default router;
