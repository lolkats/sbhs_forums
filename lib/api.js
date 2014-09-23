var SBHSStrategy = require('passport-sbhs'),
    uuid = require('node-uuid');

module.exports = function(conf){
	var sbhs = new SBHSStrategy({
		clientID:conf.clientID,
		clientSecret:conf.clientSecret,
		state:uuid.v4(),
		callbackURL: 'http://'+conf.host+'/callback'

	});
});