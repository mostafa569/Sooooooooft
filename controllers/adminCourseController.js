const Students = require('../models/student');
const Doctors = require('../models/doctor');
const Courses = require('../models/course');
const Departments = require('../models/department');
const fs = require('fs-extra');

const ExcelJS=require('exceljs')

let getCoursePage= async(req,res)=>{
    const id = req?.params?.id;
    await Departments.find({}).then((depts) => {
        res.render('adminCourse.ejs', {
            id: id,
            departments: depts
        });
    }).catch(err => {
        if (err)
            console.log(err);
    });
};


let generateSheet = async(req,res)=>{
    const id = req?.params?.id;
    const code = req.body.code;
    try {
        const student = await Students.findOne({ courses: code });
        if (student) {
            const data = await Students.find({ courses: code }).select(`name courses academicnumber`).exec();
      if (data){
         // create a new Excel workbook and worksheet
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet('Students');

         // add the headers for the 3 columns

         worksheet.columns = [
             { header: 'Academic Number', key: 'academicnumber' },
             { header: 'Name', key: 'name' },
             { header: 'courses', key: `courses` },
             { header: 'Week1', key: 'week' },
             { header: 'week2', key: 'week' },
             { header: 'Week3', key: 'week' },
             { header: 'Week4', key: 'week' },
             { header: 'Week5', key: 'week' },
             { header: 'Week6', key: 'week' },
             { header: 'Week7', key: 'week' },
             { header: 'Week8', key: 'week' },
             { header: 'Week9', key: 'week' },
             { header: 'Week10', key: 'week' },
             { header: 'Score', key: 'Score' },
         ];

         // add the data to the worksheet
         data.forEach(item => {

             worksheet.addRow({
                 name: item.name,
                 courses: code,
                 academicnumber: item.academicnumber
             });
         });

         // save the Excel file to disk
         await workbook.xlsx.writeFile(`${code}.xlsx`);
         req.flash('success', 'sheet has been generated successfully ')
         res.redirect('/admin-area/' + id+'/students');
      }else{
        req.flash('danger', 'Course not found , please enter valid data ')
        res.redirect('/admin-area/' + id+'/students');
      }
           
        }else{
            req.flash('danger', 'No students in this class ')
            res.redirect('/admin-area/' + id+'/students');
        }
    } catch (error) {
        console.error(error);
    }

};


module.exports ={addCourse, deleteCourse  ,assignCourse ,getCoursePage ,generateSheet };