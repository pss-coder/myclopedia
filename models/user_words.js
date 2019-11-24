//User_Words model
var mongoose = require('mongoose');



var UserWordsSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:String,
        required:String,
        trim:true
    },
    saved_words:[{
        wordSearched:String,
        word:Array
    }]
})


/**
 * Using user's email to find user, ensures word exists in user_word db
 * @param {String} email 
 * @param {String} wordToCheck 
 * @param {(error,isWordSaved:Boolean)} callback 
 */
function validateIsWordSaved(email,wordToCheck,callback){
    UserWords.findOne({
        email:email
    })
    .exec(function (err,userwords){
        if(err){
            callback(err,null)
        }
        else{
            const onlyWordsSearched = []
            userwords.saved_words.forEach(item => onlyWordsSearched.push(item.wordSearched.toLowerCase()) )
            var isWordSaved = onlyWordsSearched.includes(wordToCheck.toLowerCase());
            callback(null,isWordSaved);
        }
        
    })
}

/**
 * based on user_words acoount, will save/remove word 
 * @param {*} wordSearched - word user searched for
 * @param {*} wordResult - wordResult to update
 * @param {*} email - user_words to reference from
 * @param {Boolean} isToSave - determines whether to save/remove word from user_words 
 * @param {(err,isUpdate:String)} callback - returns error,update message callback
 */
function updateUserWords(wordSearched,wordResult,email,isToSave,callback){

    var operator;
    var errorMessage = "";
    var isUpdate;
    switch (isToSave) {
        case true:
            console.log('to push word')
            errorMessage = "Failed to Push word";
            isUpdate = 'Push';
            operator = {$push:{saved_words:
                {
                wordSearched:wordSearched.toLowerCase(),
                word:wordResult
                }
            },upsert: true};
             
            break;
        case false:
            console.log('to Pull word')
            errorMessage = "Failed to Pull word ";
            isUpdate = 'Pull'
            operator = {$pull:{saved_words:
                {
                wordSearched:wordSearched.toLowerCase(),
                word:wordResult
                }
            },upsert: true};
            break;
    }

    UserWords.findOneAndUpdate(
        {
            email:email
        },operator,
        function (err,userWords){
            if(err){
                console.log(err);
                callback(errorMessage,null)
            }else{
                callback(null,isUpdate);
            }
          }
        )

}

function removeUserWord(wordToRemove,email,callback){

    UserWords.findOneAndUpdate(
        {
            email:email
        },{$pull:{saved_words:
            {
            wordSearched:wordToRemove
            }
        },upsert: true},
        function (err,userWords){
            if(err){
                console.log(err);
                callback(errorMessage,false)
            }else{
                callback(null,true);
            }
          }
        )

}


UserWordsSchema.statics.validateIsWordSaved = validateIsWordSaved;
UserWordsSchema.statics.updateUserWords = updateUserWords;
UserWordsSchema.statics.removeUserWord = removeUserWord;

var UserWords = mongoose.model('UserWords',UserWordsSchema);
module.exports = UserWords;