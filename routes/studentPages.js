const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const log=require('../config/auth');
var isStudent =log.isStudent;
const controller = require('../controllers/studentController');






router.get('/:id', isStudent, controller.getStudentHome);

 


router.get('/:id/:course',isStudent,controller.getCourseFiles);

router.get('/:id/:docId/:course/:name',isStudent,controller.getFile);

 


module.exports = router;