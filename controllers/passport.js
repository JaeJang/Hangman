var a_model = require('../models/auth_model');
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

module.exports = function(passport){
    //Executed when user logs in
    //Passes user data to session
    passport.serializeUser((user,done)=>{
        console.log('serializeUser');
        return done(null, user);
    });

    //
    passport.deserializeUser((user, done)=>{
        console.log('deserializeUser ' + user.displayName);
        let sql = 'SELECT * FROM users WHERE username=?';
        let func = function(user){
            done(null,user);
        }
        a_model.select_passport(sql, [user.username], func);
        
    });

    passport.use('other-login', new LocalStrategy(
        {
            usernameField:'username',
            passwordField:'password',
            passReqToCallback:true
        },
        (req,username, password, done)=>{
            console.log('passport other login');
            a_model.verifyUser(req, username, password, done);
            
        }
    ));

    passport.use('local-login', new LocalStrategy(
        {
            passReqToCallback:true
        },
        (req,username, password, done)=>{
            let sql = 'SELECT * FROM users WHERE username=?';
            let func = function(user){
                if(user){
                    hasher({password:password, salt:user.salt},
                                    (err, pass, salt, hash)=>{
                                        if(hash === user.password){
                                            console.log("login success");
                                            return done(null, user, req.flash('login_success','Logged in successfully'));
                                        } else{
                                            console.log("login fail");
                                            done(null, false, req.flash('login_fail','Username or password is wrong'));
                                        }
                                    });
                } else {
                    console.log("login fail");
                    done(null, false, req.flash('login_fail','Username or password is wrong'));
                }
            };
            a_model.select_passport(sql,[username],func);
        }
    ));

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField:'username',
            passwordField:'password',
            passReqToCallback:true
        },
        (req,username,password,done)=>{
            console.log('passport local-signup');
            a_model.checkId(req, username, password, done);
        }
    ))
}