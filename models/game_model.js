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
            res.redirect(`/home/${user}/rank/${results.insertId}`);
        });
    },
    getRank: function(res, username,  rid){
        let sql = "SELECT * FROM ranks";
        conn.query(sql, (err, results)=>{
            if(rid){
                res.render('rank',{ranks:results, rid:rid});
            } else {
                res.render('rank',{ranks:results});
            }

        })
    }
}