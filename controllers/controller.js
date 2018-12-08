var g_model = require('../models/game_model');
var a_model = require('../models/auth_model');
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
        //a_model.test(req,res);
        res.redirect('/login');
    }
}

//GET
//Renders home page passing logged-in user data
exports.home = function(req, res) {
    console.log("home");
    let user = req.session.passport.user;
    let rid = req.session.rid;
    req.session.rid = 0;
    g_model.home_printRanks(res, req, user, rid);
    /* res.render('home', {
        //session:req.session
        user:req.session.passport.user
    }); */
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
exports.newRank = (req,res, next)=>{
    let score = req.body.score;
    let life = req.body.life;
    console.log(score, life);
    let username = req.session.passport.user.username;

    g_model.newRank(req, res, username, score, life, next);
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

//POST
//Take token and userid fro headers or body
//Sends a message back if any of them is not given
//When existed, call a_model.checkAPI to verify them and send a rank
exports.api_1_0_rank = (req,res)=>{
    let username = '';
    let token = '';
    if(req.body.apptoken){
        token = req.body.apptoken; 
    }
    else if(req.headers['apptoken']){
        token = req.headers['apptoken'];
    } else {
        return res.send("Token not provided");
    }

    if(req.body.userid){
        username = req.body.userid;
    } else if(req.headers['userid']){
        username = req.headers['userid'];
    } else{
        return res.send("Username not provided");
    }
    a_model.checkAPI(res,username,token,g_model.getRank_s);
}


exports.api_1_0_top = (req, res)=>{
    let top = 0;
    let apptoken = '';
    if(req.body.top){
        top = parseInt(req.body.top)
    } else {
        return res.send("top not provided");
    }

    if (req.body.apptoken){
        apptoken = req.body.apptoken;
    } else {
        return res.send("apptoken not provided");
    }

    g_model.topX(res, top, apptoken);
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
exports.badgeEntry = (req,res)=>{

    

//a_model.badgeLogin(req,res,'nebraska','123a456');
    res.render('exchange');
/*
   let locationHash = window.location.hash;
   let path = url.parse(req.url).pathname;
   console.log(path);
   console.log(req.params);
   
       let urlSplit = locationHash.split('#');
	       let username;
		       let token;
			       if (urlSplit.length > 2) {
						           username = urlSplit[1];
								           username = urlSplit[2];
										           a_model.badgeLogin(req,res,username,token);
												       }else {
															           console.log("no login info provided")
																			       }
*/
    

    
}
exports.badgeEntry_post = (req, res)=>{
    let username = '';
    let token = '';
    if(req.body.apptoken){
        token = req.body.apptoken; 
    }
    else if(req.headers['apptoken']){
        token = req.headers['apptoken'];
    } else {
        return res.send("Token not provided");
    }

    if(req.body.userid){
        username = req.body.userid;
    } else if(req.headers['userid']){
        username = req.headers['userid'];
    } else{
        return res.send("Username not provided");
    }
    a_model.badgeEntry(req, res, username, token);

    let sql_token = "SELECT name,token FROM apps WHERE token =?";
    conn.query(sql_token, [token], (err,results_token)=>{
        if (err) throw err;
        if(results_token.length <= 0){
            res.send("PERMISSION DENIED (INCORRECT TOKEN)");
        }  else {
            let appName = results_token[0].name;
            //if there is a session, but not the one from badge
            //log out old session
            //proceed to next page (auto log in or prompt for account)
            if(req.session.passport &&
                req.session.passport.user && 
                usernamename != req.session.passport.user.badgebook) {
                    req.logout();
                    req.session.save(()=>{
                        a_model.badgeEntry(req, res, username, appName);
                    });
            //if there is a session and same as the one from badge
            } else if(req.session.passport &&
                req.session.passport.user && username == req.session.passport.user.badgebook) {
                //no authenticiation required, redirect to home
                res.redirect('/home');
            //if there is no session
            } else {
                a_model.badgeEntry(req, res, username, appName);
            }
        }
    });
}

exports.badgeLogin = (req,res)=>{

    let locationHash = window.location.hash;
    let urlSplit = locationHash.split('#');
    let username;
    let token;
    if (urlSplit.length > 2) {
        username = urlSplit[1];
        username = urlSplit[2];
        a_model.badgeLogin(req,res,username,token);
    }else {
        console.log("no login info provided")
    }

    // let username = '';
    // let token = '';
    // if(req.body.apptoken){
    //     token = req.body.apptoken; 
    // }
    // else if(req.headers['apptoken']){
    //     token = req.headers['apptoken'];
    // } else {
    //     return res.send("Token not provided");
    // }

    // if(req.body.username){
    //     username = req.body.username;
    // } else if(req.headers['username']){
    //     username = req.headers['username'];
    // } else{
    //     return res.send("Username not provided");
    // }
}


exports.do_you_have_account = (req,res)=>{
    let message = req.flash('message');
    let errors = {
        login_fail:message[0]
    }
    console.log(message[1]);
    console.log(message[2]);
    res.render("do_you_have_account.ejs", {user:message[1], app:message[2], error:errors});
}

exports.link_out_sign_up = (req, res)=>{
    let username = req.body.username;
    let appName = req.body.appName;
    a_model.createUserForApp(req,res,username,appName);
}
