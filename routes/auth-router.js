var express = require('express');
var router = express.Router();
var User = require('../models/user');
var UserWords = require('../models/user_words');

//TODO: SEND RESPONSE TO CLIENT
router.post('/signup',function (req,res,next){

    var user = new User();
    
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;


    User.validateUserExistsbyEmail(user.email,function (userExists){
        if(!userExists){ //if user does not Exists , can create account else 
            user.save(function(err,user){
                if(err){
                    console.log('ERROR:', err);
                
                }
                else{
                    //create session 
                    req.session.user = {
                        id:user._id,
                        fullname:user.username,
                        email:user.email
                    }

                    //create document in user_words collection based on user email 
                    var uw = new UserWords();
                    uw.email = req.session.user.email;
                    //for every account made , create a entry in UserWords 
                    uw.save(function (err,uw){
                        if(err){
                            console.log(`error creating document in user_words collection for email: ${req.session.user.email}  `);
                        }
                        else{
                            console.log(`document created in user_words collection for email: ${req.session.user.email}`);
                            res.redirect('/');
                        }
                    })
                }
            })
        }
        else{ // userexists 
            console.log('Email already exists ! ')
            res.redirect('/');
        }
      })

    

  })


// /auth/login
router.post('/login',function(req,res,next){
    if(req.body){
        let email = req.body.email;
        let password = req.body.password;

        User.login(email,password,function(err,user){
            if(err || !user){
                console.log('ERROR:', err);
                let error = new Error('Wrong email or password.');
                error.status = 401;
                res.status(401).send('<h1>Error</h1>' + `${error.message}` + '<br><a type="button" href="/">Go Back</a>');
            }
            else{
                
                req.session.user = {
                    id:user._id,
                    fullname:user.username,
                    email:user.email
                }
                console.log('session user is : ', req.session.user);
                //res.status(200).json({username:username});
                res.redirect('/');
            }
          });
    }
})

// /auth/logout
router.post('/logout',function (req,res,next){
    //TODO: LOGOUT IMPLEMENTATION
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