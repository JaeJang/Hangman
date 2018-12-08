var controller = require('../controllers/controller');

module.exports = function(app, passport){
    
    //Authentication
    {
        app.get('/', controller.loggedIn, controller.home);     //home
        app.get('/home', controller.loggedIn, controller.home); //home
    
        app.get('/login', controller.login);

        //Login with BadgeBook 
        app.post('/badge/login', controller.badgeLogin);

        //Link from BadgeBook
        app.get('/badge/entry', controller.badgeEntry);
        app.post('/badge/entry', controller.badgeEntry);


        app.get('/badge/link', controller.do_you_have_account);

        app.post('/badge/signup', controller.link_out_sign_up);
        /* app.get('/badge/signup', (req,res)=>{
            res.render('signup.ejs');
            nameInApp = req.query.username;
        }); */

        app.post('/any_url_we_will_user', controller.badgeLogin);
        

        app.post('/badge/link',(req,res)=>{
            
        });
        /* app.post('/badge/link', passport.authenticate(
            'badge-link',
                {
                    failureRedirect:'/badge/link',
                    faliureFlash:true
                }
            ),
            (req,res)=>{
                req.session.save(()=>{
                    res.redirect('/');
                })
            }
        ); */
        
        //do you have account - yes - login
        app.post('/app_link',
                passport.authenticate(
                    'other-login',
                    {
                        failureRedirect:'/badge/link',
                        faliureFlash:true
                    }
                ),
                (req,res)=>{
                    req.session.save(()=>{
                        res.redirect('/home');
                    })
                }
        );

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
        

        //app.get(['/home/rank','/home/rank/:rid'], controller.rankPage);
    }
    //api call
    {
        app.post('/api/1.0/rank', controller.api_1_0_rank);

        app.post('/api/1.0/top', controller.api_1_0_top);
    }

    {

    }
}
