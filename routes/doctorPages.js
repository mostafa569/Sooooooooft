const express = require('express');
const router = express.Router();
const log = require('../config/auth');
const isDoctor = log.isDoctor;
const controller = require('../controllers/doctorController');




router.get('/:id', isDoctor, controller.getDoctorHome);


 

 


router.post('/:id/:course/upload-scores', isDoctor, controller.UPLOAD.single('file'),controller.uploadScores);





module.exports = router;