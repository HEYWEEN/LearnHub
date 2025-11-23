import express from 'express';
import { createNote, deleteNote, listNotes, updateNote } from '../controllers/noteController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/",verifyToken,createNote);

router.get("/",verifyToken,listNotes);

router.delete("/:noteId",verifyToken,deleteNote);

router.post("/:noteId",verifyToken,updateNote);

export default router;