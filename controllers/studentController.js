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


let enrollment = async (req, res) => {
  var courseArr = JSON.parse(req?.body?.coursesarray);
  var arr=[];
  if (courseArr) {
    if(courseArr.length >=4){
      if(courseArr.length <=6){
        for(let i =0; i<courseArr.length ; i++){
          arr[i]=courseArr[i];
        
        }
        Student.findById({ _id: req?.params?.id }).then(student=>{
          for(let i =0; i<student.courses.length ; i++){
              arr[arr.length+i]=student.courses[i];
          }
         
          student.updateOne({ courses: arr }).catch(err=>{
            if(err)
            console.log(err);
          });
          req.flash('success','you enrolled successfully');
          res.redirect('/students/'+req?.params?.id +'/enroll');
        }).catch((err) => {
          if (err)
            console.error(err);
        });
       
      }else{
        req.flash('danger','you can not enroll in more than 6 courses');
        res.redirect('/students/'+req?.params?.id +'/enroll');

      }
    }else{
      req.flash('danger','you can not enroll in less than 4 courses');
      res.redirect('/students/'+req?.params?.id +'/enroll');

    }
  } else {
    req.flash('danger','you must choose courses');
    res.redirect('/students/'+req?.params?.id +'/enroll');

  }

};



module.exports = { getStudentHome,  enrollment };