var express = require('express');
var router = express.Router();

var oxfordAPI = require('../oxford_api/oxford');
var User = require('../models/user');
var userWords = require('../models/user_words');


/**
 * '/' Index Endpoint
 */
router.get('/',function(req,res,next){

    const sessionUser = req.session.user;
    if(sessionUser){
        User.validateUserExistsbyId(sessionUser.id,function (userExists){
            if(userExists){
                res.render('index',{user:sessionUser});
                // res.render('index',{user:sessionUser,searchResult:undefined,saved_words:undefined,wordExists:undefined});
            }else{
                res.render('index',{user:null});
            }
          })
    }else{
        res.render('index',{user:null});
    }

    
});

router.get('/mywords',function (req,res,next){

    //get all user words and passed to client 
    if(req.session.user){
        const email = req.session.user.email;
        
        userWords.findOne({
            email:email
        })
        .exec(function (err,response){
            const userwords = response.saved_words;
            console.log(userwords);
            userwords.forEach(word => {
                console.log(`Word Saved: ${word.wordSearched}`);
                const wordResult = word.word;
                wordResult.forEach(result =>{
                    console.log(`POS: ${result.pos}`)
                    console.log('Definitions:');
                    result.definitions.forEach(def => console.log(def))
                    console.log('Examples:');
                    result.examples.forEach(example=> console.log(example))
                    console.log("=================")
                })
            });
            res.render('mywords',{user:req.session.user,saved_words:userwords});
        })
    }

})


router.get('/about',function (req,res,next){
    res.render('about');
})


/**
 * Endpoint for user to search word
 */
router.post('/search',function (req,res,next){

    const word = req.body.word;
    console.log("word you searched: ",word);

    //on search checked if got session and store the response in array into session object
    // if user is logged,
    // for every word searched, check if word is saved in user words db 
    

    oxfordAPI.search(word,function (error,response){
        if(error){
            console.log('error searching')
            res.json({error:'ERROR SEARCHING.PLEASE TRY AGAIN.'});
        }
        else{
            
            console.log('=============')
            console.log(response);
            if(req.session.user){
                req.session.wordSearched = word;
                req.session.wordResult = response;

                const email = req.session.user.email;
                userWords.validateIsWordSaved(email,word,function (err,wordExists){
                    if(err){
                        console.log(err);
                        console.log("ERROR CHECKING IF WORD EXISTS")

                        res.json({error:'ERROR SEARCHING.PLEASE TRY AGAIN.'});
                    }
                    else{

                        console.log(`is WORD SAVED : ${wordExists}`)
                        // res.render('index',{searchResult:response,saved_words:undefined,wordExists:wordExists });
                        res.json({searchResult:response,wordExists:wordExists})
                    }
                })

                
            }
            else{ // no user
                res.json({searchResult:response,wordExists:undefined})
            }
        }
      })

})

router.post('/saveword',function (req,res,next){

    
    var isToSave = req.body.toSave;;
    if(req.session.user){
        const wordResult = req.session.wordResult;
        const wordSearched = req.session.wordSearched;
        //UPDATE document in user_words collection based on user email
        const email = req.session.user.email;
        console.log('email to save word to : ' + email);

        userWords.updateUserWords(wordSearched,wordResult,email,isToSave,function (err,isUpdate){
            if(err){
                console.log(err);
                res.json({error:err});
            }
            else{
                console.log(isUpdate);
                res.json({update:isUpdate});
            }
          })
    }else{
        console.log('FAILED TO SAVE, NO SESSION FOUND');
        res.json({auth:false});
    }
    

})


router.post('/removeword',function (req,res,next){

    var wordToRemove = req.body.word;
    if(req.session.user){
        
        //UPDATE document in user_words collection based on user email
        const email = req.session.user.email;
        console.log('email to remove word to : ' + email);

        userWords.removeUserWord(wordToRemove,email,function (err,isRemoveSuccess){
            if(err){
                console.log(err);
                res.json({error:err});
            }
            else{
                res.json({isRemoveSuccess:isRemoveSuccess});
            }
          })
    }else{
        console.log('FAILED TO REMOVE, NO SESSION FOUND');
        res.json({isRemoveSuccess:false});
    }
    

})





module.exports = router;
