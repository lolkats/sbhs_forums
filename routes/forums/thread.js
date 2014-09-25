module.exports = function(app,models){
	app.get('/thread/:id',function(req,res){
		if(req.user){
			models.Thread.findOne({
				_id:req.params.id
			},function(err,thread){
				if(!thread){
					return res.status(404).json({error:"notFound"});
				}
				if(err){
					return res.status(500).json({error:"unknownError"});
				}
				models.Group.findOne({
					_id:thread.groupId
				},function(err,group){
					if(group.private!='false'){
						if(group.private=="yearGroup" && req.user.yearGroup==group.yearGroup){
							res.json(thread);
						}
						else if(req.user.privateGroups.indexOf(group._id)!=-1){
							res.json(thread);			
						}
						else if(req.user.role=="Admin"){
							res.json(thread);			
						}
						else{
							res.status(401).json({error:"accessDenied"});
						}
					}
					else{
						res.json(thread);
					}
				});
			});
		}
		else{
			res.json({error:"accessDenied"},401);
		}
	});
	app.get("/thread/:id/posts",function(req,res){
		if(req.user){
			models.Thread.findOne({
				_id:req.params.id
			},function(err,thread){
				if(!thread){
					return res.status(404).json({error:"notFound"});
				}
				if(err){
					return res.status(500).json({error:"unknownError"});
				}
				models.Group.findOne({
					_id:thread.groupId
				},function(err,group){
					if(group.private!='false'){
						if(group.private=="yearGroup" && req.user.yearGroup==group.yearGroup){
							thread.getPosts(function(err,posts){
								res.json(posts);
							});
						}
						else if(req.user.privateGroups.indexOf(group._id)!=-1){
							thread.getPosts(function(err,posts){
								res.json(posts);
							});			
						}
						else if(req.user.role=="Admin"){
							thread.getPosts(function(err,posts){
								res.json(posts);
							});			
						}	
						else{
							res.status(401).json({error:"accessDenied"});
						}
					}
					else{
						thread.getPosts(function(err,posts){
							res.json(posts);
						});
					}
				});
			});
		}
		else{
			res.status(401).json({error:"accessDenied"});
		}
	});

	
};