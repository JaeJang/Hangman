var mysql = require('mysql');
var config = require('../config/database');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var conn = mysql.createConnection({
    host: config.host,
    user: config.user,
    password : config.password,
    database: config.database
});
conn.connect();

exports.select_passport = (query, wildCard, done)=>{
    conn.query(query, wildCard, (err, results)=>{
        if(!err){
            return done(results[0]);
        }
        console.log("database error");
        console.log(query);
        //return done(err, results[0]);   
    });
}

// exports.newUser_local = (username, password, res)=>{
//     let sql = "SELECT username FROM users WHERE username=?";
//     conn.query(sql, ['local:'+username], (err,results=>{
//         if(err){
//             console.log(err);
//             res.status(500).send("Internal database error");
//         }
//         if(results.length > 0)

//     }));
//     conn.query
//     hasher({password:password}, (err, pass, salt, hash)=>{
//         var user = {
//             username
//         }
//     })
// }

exports.checkId = (req, username, password, done)=>{
    console.log('checkId');
    let sql = "SELECT username FROM users WHERE username=?";
    conn.query(sql, [username+':hangman'], (err,results)=>{
        if(results.lengt > 0){
            console.log('signup_name_error');
            done(null, false, req.flash('signup_name_error','That user name is already taked'));
        } else {
            if(!password || password.length < 4){
                console.log('signup_pwd_error');
                done(null, false, req.flash('signup_pwd_error', "Password error"));
            } else{
                hasher({password:password}, (err,pass,salt,hash)=>{
                    let user = {
                        username:username+':hangman',
                        password:hash,
                        salt:salt,
                        displayName:username
                    };

                    let sql = "INSERT INTO users SET ?";
                    conn.query(sql, user, (err,results)=>{
                        if(err){
                            console.log("DATABASE - INSERT USER");
                            done(err);
                        } else {
                            done(null, user, req.flash('signup-success','Account Created Successfully'));
                        }
                    });
                });
            }
        }
    })
}