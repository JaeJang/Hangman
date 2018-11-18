var controller = require('../controllers/controller');

module.exports = function(app, passport){
    
    //Authentication
    {
        app.get('/', controller.loggedIn, controller.home);     //home
        app.get('/home', controller.loggedIn, controller.home); //home
    
        app.get('/login', controller.login);



        /* app.post('/any_url_we_will_use'
                ,passport.authenticate(
                    'badge-login',
                    {
                        failureRedirect:'' //BadgeBook URL
                    }
                ),
                (req,res)=>{
                    req.session.save(()=>{
                        res.redirect('/home');
                    });
                }); */
        app.post('/any_url_we_will_user', controller.badgeLogin);


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
    
        app.get('/home/game', controller.game);
        
        app.get('/dic', controller.dic);
    
        app.post('/newRank', controller.newRank);

        app.get(['/home/rank','/home/rank/:rid'], controller.rankPage);
    }
    //api call
    {
        app.post('/api/1.0/rank', controller.api_1_0_rank);
    }

    {
        app.get('/:app/:username',controller.checkSession, controller.otherAppEntry);
    }
}