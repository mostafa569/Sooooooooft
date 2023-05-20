

module.exports = userValidation =  function (user,password,done){
    if(!user){
        return done(null,false, {type:'danger',message:'user not registerd in the system'});
    }
    
   
     
        if(password==user.password){
            
            return done(null,user);
        }else{
            
            return done(null,false, {type:'danger',message: 'please enter a valid password'})
        }
//    });
}