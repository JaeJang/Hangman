var mysql = require('mysql');
var config = require('../config/database');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var conn;

const createConn = ()=>{
    conn = mysql.createConnection({
        host: config.host,
        user: config.user,
        password : config.password,
        database: config.database
    });
    conn.connect((error)=>{
		if(error){
			console.log(`connecting error: ${error}`);
			setTimeout(createConn, 2000);
		}
	});
    conn.on('error', (error)=>{
		console.log('db connection error');
		console.log(error);
        if(error.code === 'PROTOCOL_CONNECTION_LOST'){
			console.log('PROTOCOL_CONNECTION_LOST had occured');
            return createConn();
        }

        throw error;
    });
}
//conn.connect();
createConn();

//Keep connecting DB
setInterval(()=>{
	conn.query('SELECT 1');
},10000);

//query :   SELECT query
//wildcard: clue for where statement
//done:     passort done function
//Called from passport
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
    conn.query(sql, [username], (err,results)=>{
        if(results.length > 0){
            console.log('signup_name_error');
            done(null, false, req.flash('signup_name_error','That user name is already taked'));
        } else {
            if(!password || password.length < 4){
                console.log('signup_pwd_error');
                done(null, false, req.flash('signup_pwd_error', "Password error"));
            } else{
                hasher({password:password}, (err,pass,salt,hash)=>{
                    let user = {
                        username:username,
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

exports.checkAPI = (res,username, token, getRank_s)=>{
    let sql_token = "SELECT name,token FROM apps WHERE token =?";
    conn.query(sql_token, [token], (err,results_token)=>{
        if (err) throw err;
        if(results_token.length <= 0){
            return res.send("PERMISSION DENIED (INCORRECT TOKEN)");
        } 
        else {
            let appName = results_token[0].name;
            /************************************************** */
            //let sql_name = `SELECT * FROM users WHERE ${appName} = '${username}'`;
            let sql_name = `SELECT u.username, u.BadgeBook, score,life 
                                FROM users as u 
                                INNER JOIN ranks as r 
                                ON u.username = r.username 
                                WHERE u.${appName} = '${username}';`
            /************************************************** */
            conn.query(sql_name, (err,results_name)=>{
                if (err) throw err;
                if(results_name.length <=0){
                    res.send({rank:"No record"});
                }
                else {
                    getRank_s(res, results_name[0],username);
                }
            });
        }
    });
}

exports.checkApp = (res, app)=>{
    let sql = `SELECT * FROM apps where name = '${app}'`;
    conn.query(sql, (err, results)=>{
        console.log(typeof results);
        if(results.length <= 0)
            res.status(404).render('404');
    });
}

exports.checkSession_user = (res, session, app, user)=>{
        if(session.user.app){
            if(session.user.app == user){
                res.redirect('/home');
            }
        }    
}

exports.badgeLogin =(req,res,username, token)=>{
    //let username = get username from request body
    
    let sql_token = "SELECT name,token FROM apps WHERE token =?";
    conn.query(sql_token, [token], (err,results_token)=>{
        if (err) throw err;
        if(results_token.length <= 0){
            res.send("PERMISSION DENIED (INCORRECT TOKEN)");
        } 
        else {
            let appName = results_token[0].name;
            let sql_name = `SELECT * FROM users WHERE ${appName} = '${username}'`;
            conn.query(sql_name, (err,results_name)=>{

                if (err) throw err;
                if(results_name.length <=0){
                    exports.createUserForApp(req, res, username, appName);
                }
                else {
                    req.logIn(results_name[0], (err)=>{
                        console.log(err);
                    });
                    req.session.save(()=>{
                        res.redirect('/');
                    });
                }
            });
        }
    });
}
exports.createUserForApp = (req, res, username, appName)=>{
    let password = Math.random().toString(36).slice(-8);

    hasher({password:password}, (err,pass,salt,hash)=>{
        let user = {
            username:username + "@" + appName,
            password:hash,
            salt:salt,
            displayName:username + "@" + appName,
        };
        user[appName] = username;

        let sql = "INSERT INTO users SET ?";
        conn.query(sql, user, (err,results)=>{
            if(err){
                console.log("DATABASE - INSERT USER");
                console.log(err);
                return ;
            } else {
                console.log('Account Created Successfully');
                req.logIn(user, (err)=>{
                    console.log('createUserForApp req.login error');
                    console.log(err);
                });
                req.session.save(()=>{
                    res.redirect('/');
                });
            }
        });
    });
}
/*
    //let sql = "SELECT * FROM users WHERE BadgeBook = username";
    let query = "SELECT * FROM users WHERE BadgeBook = ?";
    //sql query
    conn.query(query, username, (err, results)=>{
        if(!err){
            //not found, create account automatically with random password
            if(results.length==0){
                let password = Math.random().toString(36).slice(-8);

                hasher({password:password}, (err,pass,salt,hash)=>{
                    let user = {
                        username:username + "@Badge",
                        password:hash,
                        salt:salt,
                        displayName:username + "@Badge",
                        BadgeBook:username
                    };

                    let sql = "INSERT INTO users SET ?";
                    conn.query(sql, user, (err,results)=>{
                        if(err){
                            console.log("DATABASE - INSERT USER");
                            done(err);
                        } else {
                            console.log('Account Created Successfully');
                            req.logIn(user);
                            req.session.save(()=>{
                                res.redirect('/');
                            });
                        }
                    });
                });
            //badge user already in database, log user in
            } else {
                req.logIn(results[0]);
                req.session.save(()=>{
                    res.redirect('/');
                });
            }
        }
        console.log("database error");
        console.log(query); 
    });
    */


//Link out from BadgeBook
exports.badgeEntry =(req,res,username,token)=>{

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
                username != req.session.passport.user.BadgeBook) {
                    req.logout();
                    req.session.save(()=>{
                        exports.check_other_app_user(req, res, username, appName);
                    });
            //if there is a session and same as the one from badge
            } else if(req.session.passport &&
                        req.session.passport.user && 
                        username == req.session.passport.user.badgebook) {
                //no authenticiation required, redirect to home
                res.redirect('/home');
            //if there is no session
            } else {
                exports.check_other_app_user(req, res, username, appName);
            }
        }
    });



    
}

exports.check_other_app_user = (req, res, username, appName)=>{
    let query = `SELECT * FROM users WHERE ${appName} = '${username}'`;
    //sql query
    conn.query(query, username, (err, results)=>{
        if(!err){
            //not found, ask if user has account
            if(results.length == 0){
                res.render("do_you_have_account.ejs", {user:username, app:appName});
            //if found, create session and log user in  
            } else {
                req.logIn(results[0], (err)=>{
                    console.log(err);
                });
                req.session.save(()=>{
                    res.redirect('/');
                });
            }
        }
    });
}

exports.verifyUser = (req, username, password, done)=>{
    let appName = req.body.appName;
    let nameInApp = req.body.nameInApp;
    console.log(appName+', '+ nameInApp);
    let sql = "SELECT * FROM users WHERE username = ?";
    conn.query(sql, [username], (err, results)=>{
        if (err){
            return done(null, false,req.flush('Database fail',"auth_model verifyUser function"));
        } else {
            if (results.length == 1){
                let user = results[0];
                hasher({password:password, salt:user.salt},
                    (err, pass, salt, hash)=>{
                        if(hash === user.password){
                            console.log(username + " login success");
                            exports.linkAccount(appName, nameInApp, username);
                            return done(null, user, req.flash('login_success','Logged in successfully'));
                        } else{
                            console.log(username + " login fail");
                            let message = ['Username or password is wrong',nameInApp,appName];
                            done(null, false, req.flash('message',['Username or password is wrong', nameInApp, appName]));
                        }
                    });
            }
        }
    });
}

exports.linkAccount = (appName, nameInApp, username) => {
    let query = `UPDATE users SET ${appName} = '${nameInApp}' WHERE username = '${username}'`;
    //sql query
    conn.query(query, (err, results)=>{
        if (err){
            console.log("auth_model linkAccount DB error");
        }
    });
}