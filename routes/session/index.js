module.exports = function(app,models,passport){
	app.get('/login/sbhs',passport.authenticate('sbhs'));
	app.get('/login/sbhs/callback',passport.authenticate('sbhs',{
		successRedirect:'/',
		failureRedirect:'/login/fail'
	}));
	app.get('/firsttime',function(req,res,next){
		if(req.user){
			res.render('session/firsttime');
		}
		else{
		    var err = new Error('Not Found');
		    err.status = 404;
		    next(err);
		}
	});
};