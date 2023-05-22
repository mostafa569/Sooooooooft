const Doctor = require('../models/doctor');
const Student = require('../models/student');
const Course = require('../models/course');
const path = require('path')
const fs = require('fs-extra');
const { Console } = require('console');








let getStudentHome = async (req, res) => {
  const id = req?.params?.id;

  await Student.findById(id).then(student => {
    res.render('studentHome.ejs', {
      student: student,
      id: id
    });
  }).catch((err) => {
    if (err)
      console.error(err);
  });

};

let getCourseFiles = async (req, res) => {
  const id = req?.params?.id;
  const courseCode = req?.params?.course;
  await Doctor.findOne({ courses: courseCode }).then(doctor => {

    fs.readdir('public/courses/' + doctor?._id + '/' + courseCode, function (err, files) {
      if (err) {
        console.log(err);
      } else {
        var courseMaterial = files;
        res.render('Studentcourses.ejs', {
          id: id,
          docId: doctor._id,
          course: courseCode,
          courseMaterial: courseMaterial
        });
      }
    });
  }).catch((err) => {
    if (err)
      console.error(err);
  });

};


let getFile = async (req, res) => {
  res.render('pdf.ejs', {
    id: req?.params?.id,
    doc: req?.params?.docId,
    course: req?.params?.course,
    file: req?.params?.name

  })
};
 


module.exports = { getStudentHome, getCourseFiles, getFile   };