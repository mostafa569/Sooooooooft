const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isAdmin = log.isAdmin;
const Coursecontroller = require('../controllers/adminCourseController');
const Departmentcontroller = require('../controllers/adminDepartmentController');
const Doctorcontroller = require('../controllers/adminDoctorController');
const Studentcontroller = require('../controllers/adminStudentController');








router.get('/:id/departments', isAdmin , Departmentcontroller.getDepartmentPage);

router.post('/:id/departments/add-department', isAdmin, Departmentcontroller.addDepartment);

router.post('/:id/departments/delete-department', isAdmin, Departmentcontroller.deleteDepartment);




module.exports = router;

