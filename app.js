const express = require('express');
const bodyParser = require('body-parser');

// ROUTES DIR
const routes = require('./routes/router');
const authRoutes = require('./routes/auth-router');

//DATABASE & SESSION
const db = require('./database/db-manager');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

const app = express();
var port = process.env.PORT || 8080;


//EXTRAs
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
//NEED THIS FOR FETCH FORM API TO WORK
app.use(bodyParser.json());

//SESSION
app.use(session({
    secret: 'myclopedia of words',
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: db
    })
}));

//ROUTES 
app.use('/',routes);
app.use('/auth',authRoutes);

app.listen(port,function(){

    console.log(`Myclopedia App app listening on port ${port}`);
})