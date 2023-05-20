const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isAdmin = log.isAdmin;
const Coursecontroller = require('../controllers/adminCourseController');
const Departmentcontroller = require('../controllers/adminDepartmentController');
const Doctorcontroller = require('../controllers/adminDoctorController');
const Studentcontroller = require('../controllers/adminStudentController');







router.get('/:id/courses', isAdmin , Coursecontroller.getCoursePage);


router.post('/:id/courses/generate-sheet', isAdmin, Coursecontroller.generateSheet);
















module.exports = router;

