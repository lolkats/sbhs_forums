module.exports = function(app,models){
	app.get('/group/listthreadsbygid/:id',function(req,res){
		models.Group.findOne({_id:req.params.id},function(err,group){
			if(group){
				group.getThreads(function(err,threads){
					res.json(threads);
				});
			}
			else{
				res.json({error:"groupNotExists"});
			}
		});
	});

	app.get('/group/:sname/threads',function(req,res){
		models.Group.findOne({shortName:req.params.sname},function(err,group){
			if(group){
				group.getThreads(function(err,threads){
					res.json(threads);
				});
			}
			else{
				res.json({error:"groupNotExists"});
			}
		});
	});
	
};