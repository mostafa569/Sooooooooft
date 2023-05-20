const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');



router.get('/', (req, res) => {
  res.render('index.ejs')
});

router.post('/', (req, res) => {
  req.flash('danger','please check your type');
  res.render('index.ejs')
});


router.post("/admin", passport.authenticate('admin', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
    res.redirect('/admin-area/'+ req?.user?._id +'/departments');
  
});

router.post("/student",  passport.authenticate('student', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
  
    res.redirect('/students/'+ req?.user?._id);
  
});


router.post("/doctor", passport.authenticate('doctor', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
 
    res.redirect('/doctors/'+ req?.user?._id);
  
});





module.exports = router;
