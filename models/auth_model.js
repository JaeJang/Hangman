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
            res.send("PERMISSION DENIED (INCORRECT TOKEN)");
        } 
        else {
            let appName = results_token[0].name;
            let sql_name = `SELECT * FROM users WHERE ${appName} = '${username}'`;
            conn.query(sql_name, (err,results_name)=>{
                if (err) throw err;
                if(results_name.length <=0){
                    res.send({rank:"No record"});
                }
                else {
                    getRank_s(res, results_name[0]);
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

exports.badgeLogin =(req,res)=>{
    //let username = get username from request body
    //let sql = "SELECT * FROM users WHERE BadgeBook = ?";
    //sql query
    //if found
    //  req.logIn(results[0],(err)=>{})
    //not found
    //  create new account
    
}

/* exports.test = (req,res)=>{
    let sql = "SELECT * FROM users WHERE username='j'";
    conn.query(sql,(err,results)=>{
        req.logIn(results[0],(err)=>{
            console.log(err);
        });
        req.session.save(()=>{
            res.redirect('/home');
        })
    })
} */
