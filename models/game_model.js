var mysql=  require('mysql');
var config = require('../config/database');
var window = require('window');

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
            //res.status(304).redirect(`/home/${user}/rank/${results.insertId}`);
            res.send(`/home/${user}/rank/${results.insertId}`);
            //window.location = ;

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