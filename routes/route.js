var controller = require('../controllers/controller');

module.exports = function(app, passport){
    
    //Authentication
    {
        app.get('/', controller.loggedIn, controller.home);     //home
        app.get('/home', controller.loggedIn, controller.home); //home
    
        app.get('/login', controller.login);
    
        app.post('/login',
                passport.authenticate(
                    'local-login',
                    {
                        failureRedirect:'/login',
                        faliureFlash:true
                    }
                ),
                (req,res)=>{
                    req.session.save(()=>{
                        res.redirect('/home');
                    })
                }
        );
        app.post('/register',
                passport.authenticate(
                    'local-signup',
                    {
                        failureRedirect:'/login',
                        faliureFlash: true
                    }
                ),
                (req,res)=>{
                    req.session.save(()=>{
                        res.redirect('/home');
                    })
                }
        );
    }
    //In game
    {
        app.get('/logout', controller.logout);
    
        app.get('/home/:username/game', controller.game);
        
        app.get('/dic', controller.dic);
    
        app.get(['/home/:username/rank','home/:username/rank/:rid'], controller.rankPage);

        app.post('/newRank', controller.newRank)
        
    }
}