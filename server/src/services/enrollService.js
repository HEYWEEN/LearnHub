import * as repo from "../repository/enrollRepository.js";
import * as courseRepo from "../repository/coursesRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function enrollCourse({ user, courseId }) {
  return withTransaction(async (conn) => {
    const course = await courseRepo.findCourseById(conn, courseId);
    if (!course) {
      const err = new Error("课程不存在");
      err.status = STATUS.NOT_FOUND;
      throw err;
    }
    const existing = await repo.findEnrollment(conn, user.id, courseId);
    if (existing) {
      return { alreadyEnrolled: true, enrollment: existing };
    }
    const id = uuidv4();
    await repo.insertEnrollment(conn, {
      id,
      user_id: user.id,
      course_id: courseId,
    });
    const enrollment = await repo.findEnrollment(conn, user.id, courseId);
    return { alreadyEnrolled: false, enrollment };
  });
}

export async function cancelEnrollCourse({ user, courseId }) {
  await withTransaction(async (conn) => {
    const existing = await repo.findEnrollment(conn, user.id, courseId);
    if (!existing) {
      const err = new Error("您没有报名该课程");
      err.status = STATUS.BAD_REQUEST;
      throw err;
    }
    await repo.deleteEnrollment(conn, user.id, courseId);
  });
}

export async function checkEnrollStatus({ user, courseId }) {
  const existing = await withConnection((conn) =>
    repo.findEnrollment(user.id, courseId)
  );
  return { isEnrolled: !!existing };
}

//TODO
export async function getUserEnrollments({ user }) {
  const enrollments = await withConnection((conn) =>
    repo.findEnrollmentsByUserId(conn, user.id)
  );
  return enrollments;
}

export async function getCourseEnrollments({ courseId }) {
  const enrollments = await withConnection((conn) =>
    repo.findEnrollmentsByCourseId(conn, courseId)
  );
  return enrollments;
}

export async function listEnrollments({user}) {
  const enrollments = await withConnection((conn) =>
    repo.findEnrollmentByTeacherId(conn, user.id)
  );
  return enrollments;
}
