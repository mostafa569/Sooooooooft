const Students = require('../models/student');
const Studentcounter = require('../models/studentcounter');
const ExcelJS = require('exceljs');
const accountUtils =require('../util/accountInfo');
const Departments = require('../models/department');
const usernameGenerator = accountUtils.generateUserName;
const passwordGenerator = accountUtils.generateRandomPassword;


let getStudentPage= async(req,res)=>{
    const id = req?.params?.id;
    await Departments.find({}).then((depts) => {
        res.render('adminStudent.ejs', {
            id: id,
            departments: depts
        });
    }).catch(err => {
        if (err)
            console.log(err);
    });
};

let addStudent = async(req,res)=>{
    const id = req?.params?.id;
    const name = req?.body?.name;
    const department = req?.body?.department;
    const level = req?.body?.level;
    const nationalID = req?.body?.nationalid;


    await Students.findOne({ nationalid: nationalID }).then(async (student) => {
        if (student) {
            req.flash('danger', 'Student already exists ')
            res.redirect('/admin-area/' + id+'/students');
        } else {
            const username = usernameGenerator('Student');
            const password = passwordGenerator(nationalID);
            var sequence = 0;
            await Studentcounter.findOneAndUpdate({ id: "studentNumber" }, { "$inc": { "Seq": 1 } }, { new: true }).then((count) => {
                if (!count) {
                    const sc = new Studentcounter({ id: "studentNumber", Seq: 3000001 });
                    sc.save().catch((err) => {
                        if (err)
                            console.log(err);
                    });

                    sequence = 3000001;
                } else {
                    sequence = count.Seq;

                }
            }).catch((err) => {
                if (err)
                    console.log(err);
            });

            const student = new Students({ name: name, username: username, courses: [], password: password, academicnumber: sequence, nationalid: nationalID, department: department, level: level });
            student.save().catch((err) => {
                if (err)
                    console.log(err);
            });

            req.flash('success', 'Student has been successfully added ')
            res.redirect('/admin-area/' + id+'/students');


        }
    }).catch(err => {
        if (err)
            console.log(err);
    });



};







let deleteStudent = async(req,res)=>{
    const id = req?.params?.id;
    const academicnumber = req?.body?.academicnumber;
  await  Students.findOne({ academicnumber: academicnumber }).then(student => {
        if(student){
            console.log(student.courses.length > 0);
            if (student.courses.length > 0) {
                req.flash('danger', ' this student can not be deleted ');
                res.redirect('/admin-area/' + id+'/students');
            } else {
                Students.deleteOne({academicnumber: academicnumber }).catch(err => {
                    if (err)
                        console.log(err);
                });
                req.flash('success', 'Student has been deleted successfully');
                res.redirect('/admin-area/' + id+'/students');
            }
        }else{
            req.flash('danger', ' Student not found , please enter valid data ')
            res.redirect('/admin-area/' + id+'/students');
        }
       
    }).catch(err => {
        if (err)
            console.log(err);
    });

};



module.exports ={addStudent,deleteStudent,getStudentPage};