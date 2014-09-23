module.exports = function(db,models){
	var Post = db.Schema({
		userId:String,
		isReply:{type:Boolean,default:false},
		threadId:String,
		post:String
	});
	models.register('Post',Post);
};