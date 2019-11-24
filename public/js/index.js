window.onload = function(){

    navigationBarUnderlineEffect()
    authenticationModelListeners();
    
    //Form handlers
    this.document.getElementById('login-form').addEventListener('submit',loginFormHandler);
    this.document.getElementById('signup-form').addEventListener('submit',signupFormHandler)

    //search word handlers
    this.document.getElementById('search-word-form').addEventListener('submit',searchFormHandler);
    this.document.getElementById('toggle-save-word-button').addEventListener('click',toggleSavingRemovingWord);
    ;

}

//TODO:CLEAR FIELD 
function signupFormHandler(event){
    event.preventDefault();

    const  email = event.target.email.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirm_password = event.target.confirm_password.value;

    if(!(password == confirm_password)){
        alert('Passwords do not match');
        event.reset();
        return;
    }

    let form = {
        email:email,
        username:username,
        password:password
    }

    fetch('/auth/signup',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(form)
    })
    .then((res)=> {if(res.ok){return res.json()}})
    .then((data)=> {
        const auth = data.auth;
        const error = data.error;
        console.log(auth);

        if(error && error == true){
            alert('Error signing up. Please try again.')
            return;
        }
        
            if(auth == false){
                alert('Signup Failed. Email may already exists');
            }
            else if(auth == true){
                location.reload(true);
            }
    })
    .catch(err => {
        console.log('Error Message: ', err);
    })
    
}

function loginFormHandler(event){
    event.preventDefault();

    var email = event.target.email.value;
    var password = event.target.password.value;

    let form = {
        email:email,
        password:password
    }

    fetch('/auth/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(form)
    })
    .then((res)=> {if(res.ok){return res.json()}})
    .then((data)=> {
        const auth = data.auth;
        console.log(auth);
        if(auth == false){
            alert('Login Failed. Please try again.')
        }
        else if(auth == true){
            location.reload(true);
        }
    })
    .catch(err => {
        console.log('Error Message: ', err);
    })

}

function searchFormHandler(event){
    event.preventDefault();

    const wordSearched = document.getElementById('searchField').value;
    if(!/^[a-zA-Z]+$/.test(wordSearched)){ //if got non-letter in word
        alert('PLEASE ENTER A VALID WORD TO SEARCH.');
        return;
    }

    let form = {
        word:wordSearched
    };

    //toggle loading animation
    toggleSearchingAnimation();

    // every search, hide container first
    const resultContainer = document.getElementById('result-container');
    if(!resultContainer.classList.contains('closed')){
        resultContainer.classList.add('closed');
    }

    

    //call endpoint
    fetch('/search',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(form)
    })
    .then((res) => { if(res.ok){return res.json()}})
    .then((data) => {
        const error = data.error;
        const searchResults = data.searchResult;
        const wordExists = data.wordExists;
        if(error){
            alert(error);

        }else if(searchResults){
            

            const searchResult = document.getElementById('search-result');

            //display to user 
            var output = "";
            for (let i = 0; i < searchResults.length; i++) {
                const item = searchResults[i];

                output += `<h1>${item.wordSearched} - ${item.pos} </h1>`;

                for (let j = 0; j < item.definitions.length; j++) {
                    const def = item.definitions[j];
                    output += `<h3>${def}</h3>`
                }

                for (let k = 0; k < item.examples.length; k++) {
                    const example = item.examples[k];
                    output += `<h3>${example}</h3>`;
                }
                
            }

            searchResult.innerHTML = output;

            if(!(wordExists == undefined)){
                if(wordExists){ 
                    document.getElementById('toggle-save-word-image').innerHTML = 'remove';
                }
                else{
                    document.getElementById('toggle-save-word-image').innerHTML = 'add';
                }
            }

            //display results
            if(resultContainer.classList.contains('closed')){
                resultContainer.classList.toggle('closed');
            }
        }
        toggleSearchingAnimation();
    })
    .catch(err => {
        alert('ERROR SEARCHING.PLEASE TRY AGAIN.');
        toggleSearchingAnimation();
        console.log('Error message: ', err);
    })
    

}




function toggleSavingRemovingWord(){


    var toSave = false;

    //based on icon, we can determine whether to add/remove word from user words
    const saveWordImageText = document.getElementById('toggle-save-word-image').innerHTML;
    console.log('icon when submitting form : ' + saveWordImageText);
    if(saveWordImageText == 'add'){
        toSave = true;
    }

    let form = {
        toSave:toSave
    }

    fetch('/saveword',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(form)
    })
    .then((res)=> {if(res.ok){return res.json()}})
    .then((data)=> {
        const error = data.error
        const isPushorPull = data.update;
        const isauth = data.auth;

        if(error){
            alert('ERROR.Please Try again.')
        }
         if(isauth == false){
            alert('Please Login to save word!');
        }
         if(isPushorPull){
            if(isPushorPull == 'Push'){
                console.log('success in saving word')
                document.getElementById('toggle-save-word-image').innerHTML = 'remove'
            }
            else{
                console.log('success in removing word');
                document.getElementById('toggle-save-word-image').innerHTML = 'add'
            }
        }

    })
    .catch(err => {
        console.log('Error Message: ', err);
    })

}



//functions for UI purposes

function navigationBarUnderlineEffect(){

    var searchLink = document.getElementById('searchLink');
    var myWordsLink = document.getElementById('myWordsLink');

    myWordsLink.addEventListener('mouseover',function () {
        searchLink.classList.remove('activeLink');
        myWordsLink.classList.add('hoveredLink');
    })

    searchLink.addEventListener('mouseover',function () {
        searchLink.classList.add('activeLink');
        myWordsLink.classList.remove('hoveredLink');
    })

    myWordsLink.addEventListener('mouseout',function () {
        myWordsLink.classList.remove('hoveredLink');
         searchLink.classList.add('activeLink');
    })

    searchLink.addEventListener('mouseout',function () {
        searchLink.classList.add('activeLink');
        myWordsLink.classList.remove('hoveredLink');
    })

}

function toggleSearchingAnimation(){ 
    const searchBtn = document.getElementById('search_button');
    const loader = document.getElementById('loader');
    searchBtn.classList.toggle('closed');
    loader.classList.toggle('closed');
}


function authenticationModelListeners(){ 

    const modal = document.getElementById("display-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const closeButton = document.getElementById("close-button");
    const loginButton = document.getElementById('open-login-modal-button');
    
    if(loginButton){
        closeButton.addEventListener("click", function() {
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
        });
    
        loginButton.addEventListener("click",function(){
            modal.classList.toggle("closed");
            modalOverlay.classList.toggle("closed");
        
            document.getElementById('login-modal').style.display = 'flex';
            document.getElementById('sign-up-modal').style.display = 'none';
        })
        
        //add listeners to toggle between login and sign-up modals
        document.getElementById('signup-link').addEventListener('click',function(){
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('sign-up-modal').style.display = 'flex';
        })
    
        document.getElementById('login-link').addEventListener('click',function(){
            document.getElementById('login-modal').style.display = 'flex';
            document.getElementById('sign-up-modal').style.display = 'none';
        })
    }
}