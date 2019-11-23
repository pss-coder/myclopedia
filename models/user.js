//User model
var mongoose = require('mongoose');
//npm install -save bcrypt@1.0.3
//TODO: FIX TO ALLOW LATEST VERSION -- done
var bcrypt = require('bcryptjs');



var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:String,
        required:String,
        trim:true
    },
    username:{
        type:String,
        required:String
    },
    password:{
        type:String,
        required:true
    }
})

/**
 * Hashes User passwords
 * will be called first before user saves into db
 * @param {*} next 
 */
function hashPassword(next){ 
    var user = this;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            user.password = hash;
            next();
        });
    });
 }

 /**
  * 
  * @param {String} email 
  * @param {String} password 
  * @param {(error,user)} callback 
  */
 function loginUser(email,password,loginCallback){
    //find based on email since unique
     User.findOne({
         email:email
     })
     .exec(function (err,user){
         if(err){return loginCallback(err,null)}
         else if(!user){ // no user
            var err = new Error('User not found.');
            err.status = 401;
            return loginCallback(err,null);
         }
         //compare the password in db and user entered using bcrypt
         bcrypt.compare(password,user.password,function (err,result) {
             if (result){return loginCallback(null,user);}//return user 
             else{return loginCallback()}
           })
       })
}

/**
 * 
 * @param {String} userId 
 * @param {(userExists:Boolean)} userExistscallback 
 */
function validateUserExistsbyId(userId,userExistscallback){
      User.findById(userId)
    .exec(function (error, user) {
        if(error){
            userExistscallback(false)
        }
        else{
            if(user){
                userExistscallback(true)
            }
            else{
                userExistscallback(false)
            }
        }
    });
}

/**
 * 
 * @param {String} email 
 * @param {(userExists:Boolean)} UserExistscallback 
 */
function validateUserExistsbyEmail(email,userExistscallback) {
    
    User.findOne({
        email:email
    })
    .exec(function (err,user){
        if(err){
            userExistscallback(false)
        }
        else{
            if(user){ 
                userExistscallback(true)
            }
            else{
                userExistscallback(false)
            }
        }
        
      })
}


//prehook
UserSchema.pre('save',hashPassword);
//Static method to authenticate
UserSchema.statics.login = loginUser
UserSchema.statics.validateUserExistsbyId = validateUserExistsbyId
UserSchema.statics.validateUserExistsbyEmail = validateUserExistsbyEmail


var User = mongoose.model('User',UserSchema);
module.exports = User;