const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isDoctor = log.isDoctor;
const controller = require('../controllers/doctorController');




router.get('/:id', isDoctor, controller.getDoctorHome);


router.get('/:id/:course',isDoctor,controller.getCourseFiles);







router.get('/:id/:course/:name',isDoctor,controller.getFile);

 





module.exports = router;