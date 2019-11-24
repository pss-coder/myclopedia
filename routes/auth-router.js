var express = require('express');
var router = express.Router();
var User = require('../models/user');
var UserWords = require('../models/user_words');

router.post('/signup',function (req,res,next){

    var user = new User();
    
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;


    User.validateUserExistsbyEmail(user.email,function (userExists){
        if(!userExists){ //if user does not Exists , can create account else 
            user.save(function(err,user){
                if(err){
                    res.json({error:true});
                
                }
                else{
                    //create session 
                    req.session.user = {
                        id:user._id,
                        fullname:user.username,
                        email:user.email
                    }

                    //TODO: FIND A WAY TO BE ABLE TO ADD WORDS BASED ON EMAIL
                    // WITHOUTH FIRST TIME SIGNING UP
                    //create document in user_words collection based on user email 
                    var uw = new UserWords();
                    uw.email = req.session.user.email;
                    //for every account made , create a entry in UserWords 
                    uw.save(function (err,uw){
                        if(err){
                            // console.log(`error creating document in user_words collection for email: ${req.session.user.email}  `);
                            res.json({auth:true});
                        }
                        else{
                            // console.log(`document created in user_words collection for email: ${req.session.user.email}`);
                            res.json({auth:true});
                        }
                    })
                }
            })
        }
        else{ // userexists 
            // console.log('Email already exists ! ')
            res.json({auth:false});
        }
      })

    

  })


// /auth/login
router.post('/login',function(req,res,next){
    if(req.body){
        let email = req.body.email;
        let password = req.body.password;

        User.login(email,password,function(err,user){
            if(err){
                console.log('ERROR:', err);
                res.json({auth:false});
            }
            else if(user){
                
                req.session.user = {
                    id:user._id,
                    fullname:user.username,
                    email:user.email
                }
                console.log('session user is : ', req.session.user);
                res.json({auth:true});
            }
            else{
                res.json({auth:false})
            }
          });
    }
})

// /auth/logout
router.post('/logout',function (req,res,next){
    const sessionUser = req.session.user;
    if(sessionUser){

        req.session.destroy(function(err){
            if(err){
                console.log('failed to destroy session:', sessionUser)
            }
            else{res.redirect('/')}
        })
    }
  })


module.exports = router;