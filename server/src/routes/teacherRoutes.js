import express from 'express';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import { listEnrollments,getCourseByTeacherId,getStatistics, getStudentProgress } from '../controllers/teacherController.js';

const router = express.Router();

router.get('/enrollments',verifyToken,authorize(['teacher']),listEnrollments );

router.get('/enrollments/:courseId/:studentId',verifyToken,authorize(['teacher','admin']),getStudentProgress);

router.get('/courses',verifyToken,authorize(['teacher']),getCourseByTeacherId );

router.get('/statistics',verifyToken,authorize(['teacher']),getStatistics );

export default router;