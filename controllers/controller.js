

exports.loggedIn = function(req, res, next){

    //if user logged in
    if(req.session.passport.user) {
        next();
    } 
    else {
        res.redirect('/login');
    }
}

exports.home = function(req, res) {
    res.render('home', {
        //session:req.session
        user:req.session.passport.user
    });
}

exports.login = function(req,res){
    let errors={
        signup_pwd_error:req.flash('signup_pwd_error'),
        signup_name_error:req.flash('signup_name_error'),
        login_fail:req.flash('login_fail')
    }
    res.render('login',{error:errors});
}

exports.logout = (req,res)=>{
    req.logout();
    req.session.save(()=>{
        res.redirect('/');
    });
}

exports.game = (req,res)=>{
    res.render('game');
}

exports.dic = (req,res)=>{
    let dic = require('../models/dictionary');
    res.send(dic);
}

exports.newRank = (req,res)=>{
    let score = req.body.score;

}