var g_model = require('../models/game_model');
var a_model = require('../models/auth_database');
var CONST = require('../config/constants');

//GET
//Check session if user already logged in
//if not send them to login page
exports.loggedIn = function(req, res, next){

    //if user logged in
    if(req.session.passport && req.session.passport.user) {
        next();
    } 
    else {
        res.redirect('/login');
    }
}

//GET
//Renders home page passing logged-in user data
exports.home = function(req, res) {
    res.render('home', {
        //session:req.session
        user:req.session.passport.user
    });
}

//GET
//Renders login page with error messages if there is any
exports.login = function(req,res){
    let errors={
        signup_pwd_error:req.flash('signup_pwd_error'),
        signup_name_error:req.flash('signup_name_error'),
        login_fail:req.flash('login_fail')
    }
    res.render('login',{error:errors});
}

//GET
//Logout and directs them to the base
exports.logout = (req,res)=>{
    req.logout();
    req.session.save(()=>{
        res.redirect('/');
    });
}

//GET
//Renders game page
exports.game = (req,res)=>{
    res.render('game');
}

//GET
//Get dictionary that will be used for the game
//Sends back the data
exports.dic = (req,res)=>{
    let dic = require('../models/dictionary');
    res.send(dic);
}

//POST
//Get score and life and call newRank in model
//so that the new data can be inserted in database
exports.newRank = (req,res)=>{
    let score = req.body.score;
    let life = req.body.life;
    console.log(score, life);
    let username = req.session.passport.user.username;
    g_model.newRank(res, username, score, life);
    //res.send('/home');
}

//GET
//Get ranks
exports.rankPage = (req,res)=>{
    //let username = req.params.username;
    let username = req.session.passport.user.username;
    let rid = req.params.rid;

    /* if(username != username_session){
        res.status(404).render('404');
    } */
    g_model.getRank(res,username,rid);  
     
}

exports.api_1_0_rank = (req,res)=>{
    let username = '';
    let token = '';
    if(req.body.token){
        token = req.body.token;
    }
    else if(req.headers['apptoken']){
        token = req.headers['token'];
    } else {
        res.send("Token not provided");
    }

    if(req.body.username){
        username = req.body.username;
    } else if(req.headers['userid']){
        username = req.headers['userid'];
    } else{
        res.send("Username not provided");
    }
    a_model.checkAPI(res,username,token,g_model.getRank_s);
}

exports.checkSession = (req,res,next)=>{
    let app = req.params.app;
    let uname = req.params.username;
    let session = req.session.passport;
    a_model.checkApp(res,app);
    if(session && session.user){
        if(session.user[app]){
            if(session.user[app] == uname){
                res.redirect('/home');
            } else {
                req.logout();
                
                //next();
            }
        } else {
            next();
        }
        
        //res.render('other_app_login',{user:req.session.passport.user});
    } else {
        next();
    }
}
exports.otherAppEntry = (req,res)=>{
    //check session
    //if logged in, check user
    //if different, ask logout
    //
    //no session
    //if first time
    //ask if have id
    //if yes, lilnk
    //if no, create new
}