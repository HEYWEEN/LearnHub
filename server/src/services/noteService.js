import * as noteRepo from "../repository/noteRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";

export async function createNote({ user, payload }) {
  const id = uuidv4();
  const note = {
    id,
    user_id: user.id,
    course_id: payload.courseId || null,
    lesson_id: payload.lessonId || null,
    content: payload.content || "",
  };
  await noteRepo.insertNote(note);
  return await noteRepo.findNoteById(id);
}

export async function updateNote({ user, noteId, payload }) {
  const existing = await noteRepo.findNoteById(noteId);
  if (!existing) {
    const e = new Error("笔记不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  if (existing.user_id !== user.id && user.role !== "admin") {
    const e = new Error("没有权限修改该笔记");
    e.status = STATUS.FORBIDDEN;
    throw e;
  }
  const update = {};
  if (typeof payload.content !== "undefined") update.content = payload.content;
  await noteRepo.updateNoteById(noteId, update);
  return await noteRepo.findNoteById(noteId);
}

export async function deleteNote({ user, noteId }) {
  const existing = await noteRepo.findNoteById(noteId);
  if (!existing) {
    const e = new Error("笔记不存在");
    e.status = STATUS.NOT_FOUND;
    throw e;
  }
  if (existing.user_id !== user.id && user.role !== "admin") {
    const e = new Error("没有权限删除该笔记");
    e.status = STATUS.FORBIDDEN;
    throw e;
  }
  await noteRepo.deleteNoteById(noteId);
}

export async function listNotes({
  user,
  courseId,
  lessonId,
  page = 1,
  limit = 20,
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const rows = await noteRepo.listNotes({
    userId: user.id,
    courseId,
    lessonId,
    offset,
    limit,
  });
  return {
    notes: rows,
    pagination: { page: Number(page), limit: Number(limit) },
  };
}
