import STATUS from "../constants/httpStatus.js";
import { v4 as uuidv4 } from "uuid";

import * as coursesRepo from "../repository/coursesRepository.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as reviewRepo from "../repository/reviewRepository.js";
import * as learningRepo from "../repository/learningRepository.js";
import * as enrollRepo from "../repository/enrollRepository.js";
import {
  withConnection,
  withTransaction,
} from "../repository/transactionRepository.js";

export async function getCourseByTeacherId({
  page = 1,
  limit = 12,
  category = "",
  search = "",
  instructor_id,
}) {
  const offset = (Number(page) - 1) * Number(limit);
  const filters = { category, search, instructor_id };
  const [courses, total] = await withTransaction((conn) =>
    Promise.all([
      coursesRepo.findCourses(conn, { offset, limit, filters }),
      coursesRepo.countCourses(conn, { filters }),
    ])
  );
  
  return {
    courses,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getStatistics({user}) {
    const instructor_id = user.id;
    const [totalCourses, totalStudents, totalLessons, totalReviews] = await withTransaction(
      (conn) =>
        Promise.all([
          coursesRepo.countCourses(conn, {
            filters: { instructor_id },
          }),
          enrollRepo.countEnrolledStudentNumOfTeacher(conn, instructor_id),
          lessonRepo.countLessonsByInstructorId(conn, instructor_id),
          reviewRepo.countReviewsByInstructorId(conn, instructor_id),
        ])
    );
  
    return {
      totalCourses,
      totalStudents,
      totalLessons,
      totalReviews,
    };
}