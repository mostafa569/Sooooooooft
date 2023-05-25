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

let getValidCourses = async (req, res) => {
  const id = req?.params?.id;

  var validCours = [];
  var passedcourse=[];
  var studentCourse=[];

  await Student.findOne({ _id: id }).then(st => {
    for (let i = 0; i < st.passedcourses.length; i++) {
      passedcourse[i] = st.passedcourses[i]
    }
    for (let i = 0; i < st.courses.length; i++) {
      studentCourse[i] = st.courses[i]
    }
  });

  await Course.find().then(c => {
    
    if (passedcourse.length >0) {
      for (i = 0; i < c.length; i++) {
        var notpassed = true;
        var valid = false;
        var notenrolled =true;
        passedcourse.forEach(pc => {
        
          if (pc.courseCode == c[i].code) {
            notpassed = false;
          }
          if (c[i].prerequirements) {
            if (pc.courseCode == c[i].prerequirements) {
              valid = true;
             
            }
          } else {
            valid = true;
          }
        });
        if(studentCourse.length>0){
          studentCourse.forEach(sc=>{
            if (sc == c[i].code) {
              notenrolled = false;
            }
          });
        }
       
        
        if (notpassed && valid && notenrolled) {
          validCours.push(c[i]);
        }

      }
    } else {
      for (i = 0; i < c.length; i++) {
        var notpassed = true;
        var valid = true;
        var notenrolled = true;
          if (c[i]?.prerequirements) {
              valid = false;
          }
          if(studentCourse.length>0){
            studentCourse.forEach(sc=>{
              if (sc == c[i].code) {
                notenrolled = false;
              }
            });
          }
          
          if (notpassed && valid && notenrolled) {
            validCours.push(c[i]);
          }

      }
    }

  });


  res.render('enrollment.ejs', {
    validCourses: validCours,
    id: id
  })
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



module.exports = { getStudentHome, getCourseFiles, getFile, getValidCourses, enrollment };