const request = require('request');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Deprecated API AND KEYS
const endpoint = ``;
const headers = {
        app_key: '',
        app_id: ''
};

/**
 *  calls dictionary API and returns callback for display
 * 
 * @param {string} word user input to send to dictionary api
 * @callback searchCallback(err,response) err - 'WORD NOT FOUND. PLEASE TRY AGAIN'.
 * response - dict.
 */
function search(word,searchCallback){

    const url = endpoint.concat(word.toLowerCase());
    console.log('url:', url);
    

    const options = {
        method: 'GET',
        url: url,
        headers:headers
    };

    const errorMessage = 'WORD NOT FOUND. PLEASE TRY AGAIN.';

    request(options,function (err,res,body){
        if(err){
            
            searchCallback(errorMessage,null);
        }
        else{
            const result = JSON.parse(body);
            if(result.error){
                searchCallback(errorMessage,null);
            }
            else{

            //get the word searched and all of its meaning 
            // e.g 
            // Plethora : Noun 
            // a large or excessive amount of (something) 
            //console.log(response);
            // console.log(response.results);
            const filteredResult = [];
            var i = 0;
            result.results.forEach(r => {
                const wordSearched = r.id;
                console.log(`Word Searched: ${wordSearched}`)

                //
                const item = {};
                item.wordSearched = wordSearched

                const lexicalEntries = r.lexicalEntries;
                lexicalEntries.forEach(le => {
                    const pos = le.lexicalCategory.text;
                    console.log(`part of speech: ${pos}`);

                    //
                    item.pos = pos;

                    const entries = le.entries;
                    entries.forEach( e => {
                        const senses = e.senses;

                        //
                        item.definitions = []
                        item.examples = [];

                        senses.forEach(s =>{
                            const definition = s.definitions ;
                            const examples = s.examples;


                            if(definition != undefined){
                                
                                definition.forEach(d =>{
                                    console.log(`Definition: ${d}`);

                                    //
                                    item.definitions.push(d);
                                })
                            }
                            if(examples !=undefined){
                                examples.forEach(e =>{
                                    console.log(`Examples: ${e.text.trim()}`);

                                    //
                                    item.examples.push(e.text.trim());
                                })
                            }
                        })
                    })
                })

                filteredResult.push(item);
                i++;
            });


               
                searchCallback(null,filteredResult);

            }
        }
      })
}






module.exports.search = search;