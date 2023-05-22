const Doctorcounter = require('../models/doctorcounter');
const Doctors = require('../models/doctor');
const Departments = require('../models/department');
const fs = require('fs-extra');
const accountUtils =require('../util/accountInfo');
const generateUserName = accountUtils.generateUserName;
const generateRandomPassword = accountUtils.generateRandomPassword;


let getDoctorPage= async(req,res)=>{
    const id = req?.params?.id;
    await Departments.find({}).then((depts) => {
        res.render('adminDoctor.ejs', {
            id: id,
            departments: depts
        });
    }).catch(err => {
        if (err)
            console.log(err);
    });
};

let addDoctor = async(req,res)=>{
    const id = req?.params?.id;
    const name = req?.body?.name;
    const department = req?.body?.department;
    const nationalID = req?.body?.nationalid;


    await Doctors.findOne({ nationalid: nationalID }).then(async (doctor) => {
        if (doctor) {
            req.flash('danger', 'Doctor already exists ')
            res.redirect('/admin-area/' + id+'/doctors');
        } else {
            const username = generateUserName('Doctor');;
            const password = generateRandomPassword(nationalID);
            var sequence = 0;

            await Doctorcounter.findOneAndUpdate({ id: "doctorNumber" }, { "$inc": { "Seq": 1 } }, { new: true }).then((count) => {
                if (!count) {
                    const dc = new Doctorcounter({ id: "doctorNumber", Seq: 2000001 });
                    dc.save().catch((err) => {
                        if (err)
                            console.log(err);
                    });

                    sequence = 2000001;

                } else {

                    sequence = count.Seq;

                }
            }).catch((err) => {
                if (err)
                    console.log(err);
            });

            const doctor = new Doctors({ name: name, username: username, courses: [], docID: sequence, password: password, nationalid: nationalID, department: department });
            doctor.save().catch((err) => {
                if (err)
                    console.log(err);
            });
            let path = `public/courses/${doctor._id}`
            fs.mkdirSync(path, { recursive: true });

            req.flash('success', 'Doctor has been successfully added ')
            res.redirect('/admin-area/' + id+'/doctors');

        }
    }).catch(err => {
        if (err)
            console.log(err);
    });

};



let deleteDoctor = async(req,res)=>{
    const id = req?.params?.id;
    const docId = req?.body?.docId;

   await Doctors.findOneAndDelete({ docID: docId }).then(doctor => {
        if (doctor) {
            req.flash('success', 'Student has been deleted successfully');
            res.redirect('/admin-area/' + id+'/doctors');
        } else {
            req.flash('danger', ' Doctor not found , please enter valid data ')
            res.redirect('/admin-area/' + id+'/doctors');
        }
    }).catch(err => {
        if (err)
            console.log(err);
    });


};



module.exports ={deleteDoctor,addDoctor,getDoctorPage};