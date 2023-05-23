const path = require('path')
const fs = require('fs-extra');
const multer = require('multer');





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


  
 


  module.exports={uploadPdf};