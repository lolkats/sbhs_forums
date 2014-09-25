module.exports = function(db,models){
	var User = db.Schema({
		username:{type:String, required:true,unique:true},
		password:String, //Only Required for Admins
		role:{type:String, required:true}, //Student Staff StudentAdmin Admin
		givenName:{type:String, required:true},
		surname:{type:String, required:true},
		yearGroup:{type:String,required:true}, //Staff, year(student),Admin
		accessToken:{type:String,required:true},
		refreshToken:{type:String,required:true},
		privateGroups:Array,
		banned:{type:Boolean,default:false},
		anonymousDataCollection:{type:Boolean,default:false},
		firstSignOnAccepted:{type:Boolean,default:false}
	});

	User.statics.authenticate = function(params,cb){
		var self = this;
		this.findOne({username:params.username},function(err,user){
			if(user&&user.role!="Admin"){
				user.accessToken = params.accessToken;
				user.refreshToken = params.refreshToken;
				user.save(function(){});
				return cb(null,user);
			}
			if(user&&user.role=="Admin"){
				return cb(null,user);
			}
			var user = new self(params);
			if(user.role!="Student"){
				user.yearGroup = user.role;
			}
			if(user.role == "Student"){
				user.yearGroup = new Date().getFullYear() + 12-Number(user.yearGroup);
			}
			user.save(cb);
		});
	};
	User.methods.getPublicIdentity = function(){
		return({
			username:this.username,
			role:this.role,
			givenName:this.givenName,
			surname:this.surname,
			yearGroup:this.yearGroup
		});
	};
	User.methods.getPrivateIdentity = function(){
		return({
			username:this.username,
			role:this.role,
			givenName:this.givenName,
			surname:this.surname,
			yearGroup:this.yearGroup,
			privateGroups:this.privateGroups,
			banned:this.banned
		});
	};
	models.register('User',User);
};