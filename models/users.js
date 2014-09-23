module.exports = function(db,models){
	var User = db.Schema({
		username:{type:String, required:true},
		role:{type:String, required:true}, //Student or Staff,or admin
		givenName:{type:String, required:true},
		surname:{type:String, required:true},
		yearGroup:{type:String,required:true}, //Staff, year(student),Admin
		accessToken:{type:String,required:true},
		refreshToken:{type:String,required:true}
	});

	User.statics.authenticate = function(params,cb){
		var self = this;
		this.findOne({username:params.user.username},function(err,user){
			if(user){
				user.accessToken = params.accessToken;
				user.refreshToken = params.refreshToken;
				user.save(function(){});
				return cb(null,user);
			}
			var user = new self(params);
			if(user.role=="Staff"){
				user.yearGroup + "Staff";
			}
			if(user.role == "Student"){
				user.yearGroup = new Date().getFullYear() + 12-Number(user.yearGroup);
			}
			user.save(cb);
		});
	};

	models.register('User',User);
};