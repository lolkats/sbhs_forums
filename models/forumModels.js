module.exports = function(db,models){
	var Group = db.Schema({
		private: {type:String,default:'false'}, //Can be true or yearGroup as well
		yearGroup: String, //For private forums left null
		name:{type: String,required:true},
		shortName:{type: String, required:true,unique:true},
		description:String,
		admin: String,
		pinned:String //Pinned thread

	});
	Group.statics.upsertYearGroup = function(yearGroup,cb){
		if(!cb){cb=function(){}}
		var self = this;
		self.findOne({yearGroup:yearGroup},function(err,group){
			if(!group){
				var group = new self({
					private:'yearGroup',
					yearGroup:yearGroup,
					name:"Class of "+yearGroup,
					description:"A private discussion forum for the class of " +yearGroup,
					shortName:'class'+yearGroup
				});
				group.save(function(err,g){
					if(g){
						g.createThread({name:"Assessments"},function(){});
					}
					cb(null,group);
				});

			}
			else{cb(null,group);}
		});
	};
	Group.methods.createThread = function(params,cb){
		var thread = new models.Thread({
			groupId:this._id,
			creator:params.creator,
			name:params.name
		});
		thread.save(cb);
	};
	Group.methods.getThreads = function(cb){
		models.Thread.find({groupId:this._id}).select('_id name open').exec(cb);
	};
	var Thread = db.Schema({
		groupId:{type:String, required:true},
		creator:{type:String,default:"Forum Bot"},
		name:{type:String,required:true},
		open:{type:String,default:true}
	});
	Thread.methods.delete = function(threadId){

	};

	models.register('Group',Group);
	models.register('Thread',Thread);
};