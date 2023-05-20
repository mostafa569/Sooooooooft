const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isAdmin = log.isAdmin;
const Coursecontroller = require('../controllers/adminCourseController');
const Departmentcontroller = require('../controllers/adminDepartmentController');
const Doctorcontroller = require('../controllers/adminDoctorController');
const Studentcontroller = require('../controllers/adminStudentController');







router.get('/:id/doctors', isAdmin , Doctorcontroller.getDoctorPage);


router.post('/:id/doctors/add-doctor', isAdmin, Doctorcontroller.addDoctor);



router.post('/:id/doctors/delete-doctor', isAdmin, Doctorcontroller.deleteDoctor);




module.exports = router;

