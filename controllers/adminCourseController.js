const Students = require('../models/student');
const Doctors = require('../models/doctor');
const Courses = require('../models/course');
const Departments = require('../models/department');
const fs = require('fs-extra');


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

let addCourse = async(req,res)=>{
    const id = req?.params?.id;
    const name = req?.body?.name;
    const code = req?.body?.code;
    const department = req?.body?.department;
    const preReq = req?.body?.prereq
    

    await Courses.findOne({ code: code }).then(course => {
        if (course) {
            req.flash('danger', 'Course already exists ')
            res.redirect('/admin-area/' + id+'/courses');
        } else {
            if (preReq) {
                Courses.findOne({ code: preReq }).then(c => {
                    if (c) {
                        const cr = new Courses({ name: name, code: code, dept: department, prerequirements: preReq ,docId:0});
                        cr.save().then(() => {
            
                            req.flash('success', 'Course has been successfully added ')
                            res.redirect('/admin-area/' + id+'/courses');
                        }).catch(err => {
                            if (err)
                                console.log(err);
                        });
                    } else {
                        req.flash('danger', 'Pre-requirement not found , please enter valid data ')
                        res.redirect('/admin-area/' + id+'/courses');
                    }
                });
            }else{
                const cr = new Courses({ name: name, code: code, dept: department ,docId:0 });
                cr.save().then(() => {
    
                    req.flash('success', 'Course has been successfully added ')
                    res.redirect('/admin-area/' + id+'/courses');
                }).catch(err => {
                    if (err)
                        console.log(err);
                });
            }
           




        }


    }).catch(err => {
        if (err)
            console.log(err);
    });


};



let assignCourse = async(req,res)=>{
    const id = req?.params?.id;
    const courseid = req?.body?.code;
    const DId = parseInt(req?.body?.DocId);
    var assigned =false;
    await Doctors.findOne({ docID: DId }).then((doc) => {

        if (doc) {
           doc.courses.forEach(c=>{
              if(c == courseid){
                assigned=true;
              }
           });
           if(assigned == true){
            req.flash('danger', 'course already assigned to this doctor ')
            res.redirect('/admin-area/' + id+'/courses');
           }else{
            Courses.findOne({ code: courseid }).then((course) => {

                if (course) {
                    if( course.docId==0){
                        doc.courses.push(course.code);

                        doc.updateOne({ courses: doc.courses }).catch((err) => {if(err) console.log(err)});
                        let path = `public/courses/${doc._id}/${course.code}`
                        fs.mkdirSync(path, { recursive: true });
                        course.updateOne({docId:doc.docID}).catch((err) => {if(err) console.log(err)});;
                        req.flash('success', 'Course has been successfully asigned ')
    
                        res.redirect('/admin-area/' + id+'/courses');
                        
                    }else{
                        req.flash('danger', 'Course already assigned to another doctor ')
                        res.redirect('/admin-area/' + id+'/courses');
                    }
                       
                } else {
                  req.flash('danger', 'Course not found , please enter valid data ')
                   
                   
                    res.redirect('/admin-area/' + id+'/courses');
                }

            });
           }
            
           

        } else {
        
            req.flash('danger', 'Doctor not found , please enter valid data ')
            res.redirect('/admin-area/' + id+'/courses');
        }



    }).catch(err => {
        if (err)
            console.log(err);
    });


};



let deleteCourse = async(req,res)=>{
    const id = req?.params?.id;
    const code = req?.body?.code;
 await   Courses.findOne({ code: code }).then(course => {
        if (course) {
          Students.findOne({ courses: code }).then(student => {
                if (student) {
                    req.flash('danger', 'this course can not be deleted ')
                    res.redirect('/admin-area/' + id+'/courses');
                } else {
                    Courses.deleteOne({ code: code }).catch(err => {
                        if (err)
                            console.log(err);
                    });
                    req.flash('success', 'Course has been deleted successfully  ')
                    res.redirect('/admin-area/' + id+'/courses');
                }
            }).catch(err => {
                if (err)
                    console.log(err);
            });
        } else {
            req.flash('danger', 'Course not found , please enter valid data ')
            res.redirect('/admin-area/' + id+'/courses');
        }
    }).catch(err => {
        if (err)
            console.log(err);
    });
};





module.exports ={addCourse, deleteCourse  ,assignCourse ,getCoursePage };

