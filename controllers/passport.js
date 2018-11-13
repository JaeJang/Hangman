var db = require('../models/auth_database');
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

module.exports = function(passport){
    passport.serializeUser((user,done)=>{
        console.log('serializeUser');
        return done(null, user);
    });

    passport.deserializeUser((user, done)=>{
        console.log('deserializeUser ' + user.displayName);
        let sql = 'SELECT * FROM users WHERE username=?';
        let func = function(user){
            done(null,user);
        }
        db.select_passport(sql, [user.username], func);
        
    });

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
            db.select_passport(sql,['local:'+username],func);
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
            db.checkId(req, username, password, done);
        }
    ))
}