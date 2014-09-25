module.exports = function(app,models){
	app.get('/me',function(req,res){
		if(req.user){
			res.json(req.user.getPrivateIdentity());
		}
		else{
			res.status(401).json({error:"accessDenied"});
		}
	});
	app.get('/user/:id',function(req,res){
		models.User.findOne({username:req.params.id},function(err,user){
			if(user){
				if(req.user){
					if(req.user.role=="Admin"){
						return res.json(user.getPrivateIdentity());
					}
				}
				res.json(user.getPublicIdentity());
			}
			else{
				res.status(404).json({error:'notFound'});
			}
		});
	});
};