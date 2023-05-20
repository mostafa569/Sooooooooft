const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isAdmin = log.isAdmin;
const Coursecontroller = require('../controllers/adminCourseController');
const Departmentcontroller = require('../controllers/adminDepartmentController');
const Doctorcontroller = require('../controllers/adminDoctorController');
const Studentcontroller = require('../controllers/adminStudentController');




router.get('/:id/students', isAdmin , Studentcontroller.getStudentPage);

router.post('/:id/students/add-student', isAdmin,Studentcontroller.addStudent);



router.post('/:id/students/delete-student', isAdmin, Studentcontroller.deleteStudent);



router.get('/:id/courses', isAdmin , Coursecontroller.getCoursePage);


router.post('/:id/courses/generate-sheet', isAdmin, Coursecontroller.generateSheet);
















module.exports = router;

