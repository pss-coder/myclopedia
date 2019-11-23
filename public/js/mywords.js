window.onload = function(){

    navigationBarUnderlineEffect()
    accordianDisplay();
}

function navigationBarUnderlineEffect(){

    var searchLink = document.getElementById('searchLink');
    var myWordsLink = document.getElementById('myWordsLink');

    myWordsLink.addEventListener('mouseover',function () {
        myWordsLink.classList.add('activeLink');
        searchLink.classList.remove('hoveredLink');
    })

    myWordsLink.addEventListener('mouseout',function () {
        searchLink.classList.remove('hoveredLink');
        myWordsLink.classList.add('activeLink');
    })

    searchLink.addEventListener('mouseover',function () {
        myWordsLink.classList.remove('activeLink');
        searchLink.classList.add('hoveredLink');
    })

    searchLink.addEventListener('mouseout',function () {
        myWordsLink.classList.add('activeLink');
        searchLink.classList.remove('hoveredLink');
    })

}


function accordianDisplay(){
    var acc = document.getElementsByClassName('accordion');
    for (var i = 0; i < acc.length; i++) {
        
        //everytime accordian is clicked
        acc[i].addEventListener('click',function () {
            //set accordian to active
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            })
    }
}


function removeWord(word,index){
    console.log(word);
    console.log(index);

    let form = {
        word:word
    }

    




    fetch('/removeword',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(form)
    })
    .then((res)=> {if(res.ok){return res.json()}})
    .then((data)=> {
        const error = data.error;
        const isRemoveSuccess = data.isRemoveSuccess;
        if(error){
            alert('Error removing word. Please Try again.')
        }
        else if(isRemoveSuccess == true){
            alert('word removed');
            //update UI
            var resultContainer = document.getElementById('result-container');
    
            for (let i = 0; i < resultContainer.children.length; i++) {
                var element = resultContainer.children[i];
                var wordDisplayed = element.getElementsByClassName('accordion')[0].innerHTML;
                
                if(wordDisplayed == word){
                    element.remove();
                    return;
                }
    }


        }
        else{
            alert('word not removed');
        }
    })
    .catch(err => {
        console.log('Error Message: ', err);
    })
}