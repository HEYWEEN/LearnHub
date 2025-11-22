import * as repo from "../repository/enrollRepository.js";
import * as courseRepo from "../repository/coursesRepository.js";
import { v4 as uuidv4 } from "uuid";
import STATUS from "../constants/httpStatus.js";

export async function enrollCourse({ user, courseId }) {
  const course = await courseRepo.findCourseById(courseId);
  if (!course) {
    const err = new Error("课程不存在");
    err.status = STATUS.NOT_FOUND;
    throw err;
  }
  const existing = await repo.findEnrollment(user.id, courseId);
  if (existing) {
    return { alreadyEnrolled: true, enrollment: existing };
  }
  const id = uuidv4();
  await repo.insertEnrollment({ id, user_id: user.id, course_id: courseId });
  const enrollment = await repo.findEnrollment(user.id, courseId);
  return { alreadyEnrolled: false, enrollment };
}

export async function cancelEnrollCourse({ user, courseId }) {
  const existing = await repo.findEnrollment(user.id, courseId);
  if (!existing) {
    const err = new Error("您没有报名该课程");
    err.status = STATUS.BAD_REQUEST;
    throw err;
  }
  await repo.deleteEnrollment(user.id, courseId);
}
