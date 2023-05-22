const Doctor = require('../models/doctor');
const Student = require('../models/student');
const ExcelJS = require('exceljs');
const path = require('path')
const fs = require('fs-extra');
const multer = require('multer');
const UPLOAD = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');


 

  let getDoctorHome= async(req,res)=>{
    const id = req?.params?.id;
    try {
      const doctor = await Doctor.findById(id);
      res.render('doctor.ejs', { doctor, id });
    } catch (err) {
      console.error(err);
    }

  };
 


  module.exports={getDoctorHome };