module.exports = function(app,models){
	var router = app.Router();
	require('./group')(router,models);
	require('./thread')(router,models);
	app.use('/api/forums',router);
};