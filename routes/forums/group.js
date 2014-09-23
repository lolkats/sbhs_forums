module.exports = function(app,models){
	app.get('/group/listthreadsbygid/:id',function(req,res){
		models.Group.findOne({_id:req.params.id},function(err,group){
			if(group){
				if(user.role == "Admin"){
					group.getThreads(function(err,threads){
						res.json(threads);
					});					
				}
				else if(group.private!='false' && user.role!= "Admin"){
					if(group.private=="yearGroup"&&req.user.yearGroup==user.yearGroup){
						group.getThreads(function(err,threads){
							res.json(threads);
						});
					}
					else if(group.private=="true"&&req.user.privateGroups.indexOf(group._id)!=-1){
						group.getThreads(function(err,threads){
							res.json(threads);
						});
					}
					else{
						res.json({error:"accessDenied"},401);
					}
				}
				else{
					group.getThreads(function(err,threads){
						res.json(threads);
					});
				}
			}
			else{
				res.json({error:"groupNotExists"},404);
			}
		});
	});

	app.get('/group/:sname/threads',function(req,res){
		if(req.user){
			models.Group.findOne({shortName:req.params.sname},function(err,group){
				if(group){
					if(user.role == "Admin"){
						group.getThreads(function(err,threads){
							res.json(threads);
						});					
					}
					else if(group.private!='false' && user.role!= "Admin"){
						if(group.private=="yearGroup"&&req.user.yearGroup==user.yearGroup){
							group.getThreads(function(err,threads){
								res.json(threads);
							});
						}
						else if(group.private=="true"&&group.privateUsers.indexOf(req.user.username)!=-1){
							group.getThreads(function(err,threads){
								res.json(threads);
							});
						}
						else{
							res.json({error:"accessDenied"},401);
						}
					}
					else{
						group.getThreads(function(err,threads){
							res.json(threads);
						});
					}
				}
				else{
					res.json({error:"groupNotExists"},404);
				}
			});
		}
		else {
			res.json({error:"accessDenied"},401);
		}
	});
	app.get('/groups',function(req,res){
		if(req.user){
			models.Group.find({$or:[
				{private:'false'},
				{yearGroup:req.user.yearGroup},
				{privateUsers:{$elemMatch:req.user.username}}
			]}).select('name shortName').exec(function(err,groups){
				res.json(groups);
			});
		}
		else{
			res.json({error:"accessDenied"},401);
		}
	});
	
};