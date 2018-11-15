var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db_config = require('./config/database');
var passport = require('passport');
var flash = require('connect-flash');

var CONSTANTS = require('./config/constants');

//Set Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set body-parser to get parameters from post
app.use(bodyParser.urlencoded({ extended : false}));
//set public folder
app.use(express.static('public'));

//use session with database
app.use(session({
    secret:'eijfEIJ!@djfIE9673',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
        host: db_config.host,
        port: db_config.port,
        user: db_config.user,
        password: db_config.password,
        database: db_config.database
    })
}));

//user passport for Authentication
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

//defines passport
require('./controllers/passport')(passport);
//defines routes
require('./routes/route.js')(app,passport);

app.listen(CONSTANTS.PORT, ()=>{
    console.log("Connected to " + CONSTANTS.PORT);
})
