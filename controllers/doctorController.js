const Doctor = require('../models/doctor');
const Student = require('../models/student');
const ExcelJS = require('exceljs');
const path = require('path')
const fs = require('fs-extra');
const multer = require('multer');
const UPLOAD = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const doctor = req.params.id;
      const course = req.params.course;
  
      let path = `public/courses/${doctor}/${course}`
      fs.mkdirSync(path, { recursive: true });
      cb(null, path)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /pdf/;
      const extname = filetypes.test(path.extname(file.originalname));
      if (extname) {
        req.flash('success', 'File uploaded successfully');
        return cb(null, true);
      }
     req.flash('danger','File type not compatible , please choose pdf file');
     return cb(null,false);
    }
  });
  

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


  let uploadPdf= async(req,res)=>{
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


  
  let uploadScores= (req,res)=>{
    const id = req?.params?.id;
    const courseCode = req?.params?.course;
  
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    } else {
  
      var workbook = XLSX.readFile(req.file.path);
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      var arr = Object.entries(data);
      var passedStudentArr;
      var filtered;
      var valid = true;
  
      for (let i = 1; i < arr.length; i++) {
        for (let j = 1; j < arr[i].length; j++) {
          Student.findOne({ academicnumber: arr[i][j][0], courses: arr[i][j][2] }).then(student => {
  
            if (student) {
  
              passedStudentArr = student.passedcourses;
              filtered = student.courses;
  
              if (arr[i][j][13] >= 50) {
  
                filtered = student.courses.filter(function (value, index, array) {
                  return value !== arr[i][j][2];
                });
                passedStudentArr.push({ courseCode: arr[i][j][2], score: arr[i][j][13] });
              }
              student.updateOne({ passedcourses: passedStudentArr, courses: filtered }).catch(err => { if (err) console.log(err); });
  
            } else {
              valid = false;
            }
  
  
          }).catch(err => {
            if (err)
              console.log(err);
          });
  
  
        }
      }
  
      fs.readdir('public/courses/' + id + '/' + courseCode, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          var courseMaterial = files;
          if (valid) {
            req.flash('success', 'Scores have been updated');
          } else {
            req.flash('danger', 'please enter valid data');
          }
  
          res.render('courses.ejs', {
            id: id,
            course: courseCode,
            courseMaterial: courseMaterial
          });
  
        }
      });
  
  
    }

  };


  module.exports={getDoctorHome, getCourseFiles,getFile,uploadPdf,uploadScores,upload,UPLOAD};