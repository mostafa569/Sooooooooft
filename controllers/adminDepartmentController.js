const Students = require('../models/student');
const Departments = require('../models/department');
const accountUtils =require('../util/accountInfo');
const usernameGenerator = accountUtils.generateUserName;
const passwordGenerator = accountUtils.generateRandomPassword;


let getDepartmentPage= async(req,res)=>{
    const id = req?.params?.id;
    
        res.render('adminDepartment.ejs', {
            id: id
        });
  
};

let addDepartment = async(req,res)=>{
    const id = req?.params?.id;
    const name = req?.body?.name;
    const code = req?.body?.code;

    await Departments.findOne({ code: code }).then(dept => {
        if (dept) {
            req.flash('danger', 'Department already exists')
            res.redirect('/admin-area/' + id+'/departments');

        } else {
            const dept = new Departments({ name: name, code: code });
            dept.save().catch((err) => {
                if (err)
                    console.log(err);
            });
            req.flash('success', 'Department has been successfully added ')
            res.redirect('/admin-area/' + id+'/departments');
        }
    }).catch(err => {
        if (err)
            console.log(err);
    });

};

let deleteDepartment = async(req,res)=>{
    const id = req?.params?.id;
    const code = req?.body?.code;


    await Departments.findOne({ code: code }).then(dept => {
        if (dept) {
            
            Students.findOne({ department: dept.code }).then(student => {
                if (student) {
                    req.flash('danger', ' Department may contain students.....you can not delete it')
                    res.redirect('/admin-area/' + id+'/departments');
                } else {
                    Departments.deleteOne({ code: code }).catch(err => {
                        if (err)
                            console.log(err);
                    });
                    req.flash('success', 'Department has been deleted successfully')
                    res.redirect('/admin-area/' + id+'/departments');
                }
            }).catch(err => {
                if (err)
                    console.log(err);
            });
        } else {
            req.flash('danger', 'Department not found , please enter valid Code ')
            res.redirect('/admin-area/' + id+'/departments');
        }
    }).catch(err => {
        if (err)
            console.log(err);
    });

};


module.exports ={addDepartment, deleteDepartment ,getDepartmentPage};