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

  let getCourseFiles= async(req,res)=>{
    const id = req?.params?.id;
    const courseCode = req?.params?.course;
    fs.readdir('public/courses/' + id + '/' + courseCode, function (err, files) {
      if (err) {
        console.log(err);
      } else {
        var courseMaterial = files;
        res.render('courses.ejs', {
          id: id,
          course: courseCode,
          courseMaterial: courseMaterial
        });
      }
    });
  
  };


  let getFile= async(req,res)=>{
    res.render('pdf.ejs', {
        doc: req?.params?.id,
        course: req?.params?.course,
        file: req?.params?.name
    
      })
  };

 


  module.exports={getDoctorHome, getCourseFiles,getFile,uploadPdf,uploadScores,upload,UPLOAD};