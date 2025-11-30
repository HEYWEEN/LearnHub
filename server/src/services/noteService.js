import * as noteRepo from "../repository/noteRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function createNote({ user, payload }) {
  const id = uuidv4();
  const note = {
    id,
    user_id: user.id,
    course_id: payload.courseId || null,
    lesson_id: payload.lessonId || null,
    content: payload.content || "",
  };
  // 确保把 pool/conn 传给 repository 并 await
  await withConnection(async (pool) => {
    await noteRepo.insertNote(pool, note);
  });
  return await withConnection(async (pool) => {
    return await noteRepo.findNoteById(pool, id);
  });
}

export async function updateNote({ user, noteId, payload }) {
  const existing = await withConnection((pool) =>
    noteRepo.findNoteById(pool, noteId)
  );
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
  await withConnection(async (pool) => {
    await noteRepo.updateNoteById(pool, noteId, update);
  });
  return await withConnection((pool) => noteRepo.findNoteById(pool, noteId));
}

export async function deleteNote({ user, noteId }) {
  const existing = await withConnection((pool) =>
    noteRepo.findNoteById(pool, noteId)
  );
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
  await withConnection((pool) => noteRepo.deleteNoteById(pool, noteId));
}

export async function listNotes({
  user,
  courseId,
  lessonId,
  page = 1,
  limit = 20,
}) {
  const offset = (Number(page) - 1) * Number(limit);
  // 在事务中使用同一个 connection
  const [notes, total] = await withTransaction(async (conn) =>
    Promise.all([
      noteRepo.listNotes(conn, {
        userId: user.id,
        courseId,
        lessonId,
        offset,
        limit,
      }),
      noteRepo.countNotes(conn, {
        userId: user.id,
        courseId,
        lessonId,
      }),
    ])
  );
  return {
    notes,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
