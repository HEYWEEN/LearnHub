import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import * as noteService from "../services/noteService.js";

const createNote = asyncHandler(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const note = await noteService.createNote({ user, payload });
  return sendSuccess(res, "笔记创建成功", { note });
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const user = req.user;
  const payload = req.body;
  const updated = await noteService.updateNote({ user, noteId, payload });
  return sendSuccess(res, "笔记更新成功", { note: updated });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const user = req.user;
  await noteService.deleteNote({ user, noteId });
  return sendSuccess(res, "笔记删除成功", { noteId });
});

const listNotes = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId, lessonId, page = 1, limit = 20 } = req.query;
  const result = await noteService.listNotes({
    user,
    courseId,
    lessonId,
    page,
    limit,
  });
  return sendSuccess(res, "获取笔记列表成功", result);
});

export { createNote, updateNote, deleteNote, listNotes };
