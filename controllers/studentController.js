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
 

module.exports = { getStudentHome  };