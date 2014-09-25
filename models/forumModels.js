module.exports = function(db,models){
	var Group = db.Schema({
		private: {type:String,default:'false'}, //Can be true or yearGroup as well
		yearGroup: String, //For private forums left null
		name:{type: String,required:true},
		shortName:{type: String, required:true,unique:true},
		description:String,
		admin: String,
		privateUsers:Array,
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
			creator:params.creator||"forumBot",
			name:params.name
		});
		thread.save(cb);
	};
	Group.methods.getThreads = function(cb){
		models.Thread.find({groupId:this._id}).select('_id name open creator').exec(cb);
	};


	var Thread = db.Schema({
		groupId:{type:String, required:true},
		creator:{type:String,default:"forumBot"},
		name:{type:String,required:true},
		open:{type:String,default:true}	
	});
	Thread.methods.getPosts = function(cb){
		models.Post.find({threadId:this._id}).sort({'created_at':-1}).exec(cb);
	};
	Thread.methods.createPost = function(params,cb){
		var post = new models.Post({
			creator:params.creator||"forumBot",
			threadId:this._id,
			text:params.text,
			likes:[],
			flags:[]
		});
		post.save(cb);
	};
	Thread.methods.delete = function(cb){
		var self = this;
		models.Post.remove({threadId:this._id},function(err,res){
			if(!err){
				self.destroy(cb);
			}
			else{
				cb(err);
			}
		});
	};

	var Post = db.Schema({
		creator:{type:String,default:"forumBot"},
		likes:Array,
		flags:Array,
		threadId:{type:String,required:true},
		text:{type:String,min:1},
		isReply:{type:Boolean,default:false}
	});

	models.register('Group',Group);
	models.register('Thread',Thread);
	models.register('Post',Post);
};