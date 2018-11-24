var mysql=  require('mysql');
var config = require('../config/database');

var conn = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
conn.connect();

//Keep connecting DB
setInterval(()=>{
	conn.query('SELECT 1');
},10000);

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
    
    getRank_s: function(res, user, username){
        
        let sql = "SELECT * FROM ranks ORDER BY score DESC, life DESC";
        conn.query(sql, (err, results)=>{
            if(err)
                throw err;
            
            let rank = 1;
            let pre = results[0].score;
            if(results[0].username != user.username){
                for(let i = 1; i < results.length; ++i){
                    let score = results[i].score;
                    if(score === pre){
                        if(results[i].life != results[i-1].life){
                            ++rank;
                        }
                    }else{
                        ++rank;
                    }
                    pre = score;
                    if(results[i].username == user.username)
                        break;
                }
            }
            res.send({user:username, appname:'Hangman', badgetype:'Rank', value:rank});
        });
            
        
    }
}