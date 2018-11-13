var mysql=  require('mysql');
var config = require('../config/database');

var conn = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
conn.connect();

module.exports={


    newRank: function(res, user, score, life){
        let newR = {
            username:user,
            score:score,
            life:life
        };
        let sql = "INSERT INTO ranks SET ?";
        conn.query(sql, newR, (err, results)=>{
            if(err){
                throw err;
            }
            console.log("inserted");
            res.send(`/home/rank/${results.insertId}`);

        });
    },
    getRank: function(res, username,  rid){
        let sql = "SELECT * FROM ranks ORDER BY score DESC, life DESC";
        conn.query(sql, (err, results)=>{
            if(rid){
                res.render('rank',{ranks:results, rid:rid});
            } else {
                res.render('rank',{ranks:results});
            }

        })
    },
    
    getRank_s: function(res, username){
        let sql = "SELECT username FROM ranks WHERE username=?";
        conn.query(sql,username, (err,results)=>{
            if(err)
                throw err;
            if(results.length > 0){
                let sql = "SELECT * FROM ranks ORDER BY score DESC, life DESC";
                conn.query(sql, (err, results)=>{
                    if(err)
                        throw err;
                    
                    let rank = 1;
                    let pre = results[0].score;
                    if(results[0].username != username){
                        for(let i = 1; i < results.length; ++i){
                            let score = results[i].score;
                            if(score === pre)
                                continue;
                            ++rank;
                            if(results[i].username == username)
                                break;
                        }
                    }
                    res.send({rank:rank});
                });
            } else {

                res.send({rank:'No record'});
            }
        });
    }
}