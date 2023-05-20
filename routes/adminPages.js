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

router.get('/:id/departments', isAdmin , Departmentcontroller.getDepartmentPage);

router.post('/:id/departments/add-department', isAdmin, Departmentcontroller.addDepartment);

router.post('/:id/departments/delete-department', isAdmin, Departmentcontroller.deleteDepartment);


router.get('/:id/courses', isAdmin , Coursecontroller.getCoursePage);



router.post('/:id/courses/add-course', isAdmin, Coursecontroller.addCourse);

router.post('/:id/courses/generate-sheet', isAdmin, Coursecontroller.generateSheet);


router.post('/:id/courses/assign-course', isAdmin, Coursecontroller.assignCourse);



router.post('/:id/courses/delete-course', isAdmin, Coursecontroller.deleteCourse);


router.get('/:id/doctors', isAdmin , Doctorcontroller.getDoctorPage);


router.post('/:id/doctors/add-doctor', isAdmin, Doctorcontroller.addDoctor);



router.post('/:id/doctors/delete-doctor', isAdmin, Doctorcontroller.deleteDoctor);















module.exports = router;

