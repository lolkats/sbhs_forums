var config = require('./config'),
    express = require('express'),
    BodyParser = require('body-parser'),
    Session = require('express-session'),
    fs = require('fs'),
    db = require('./lib/db')(config.db),
    models = db.models,
    Uuid = require('node-uuid'),
    passport = require('passport'),
    SBHSStrategy = require('passport-sbhs'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    dust = require('adaro');

var app = express();

app.set('port', process.env.PORT||3000);
app.set('views', path.join(__dirname, 'views'));

if(app.get('env') == 'development'){
    app.set('view engine', 'dust');
    app.engine('dust', dust.dust({cache: false}));
}
if(app.get('env') == 'production'){
    app.set('view engine', 'js');
    app.engine('js', dust.js({cache: true}));
};

passport.serializeUser(function(user,done){done(null,user);});
passport.deserializeUser(function(user,done){
    models.User.findOne({username:user},function(err,user){
        done(null,user);
    });
});

var sbhs = new SBHSStrategy({
    clientID:config.sbhs.clientID,
    clientSecret:config.sbhs.clientSecret,
    state:Uuid.v4(),
    callbackURL: 'http://'+config.sbhs.host+'/login/sbhs/callback'
},function(accessToken,refreshToken,profile,done){
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    models.User.authenticate(profile,function(err,user){
        models.Group.upsertYearGroup(user.yearGroup);
        done(null,user.username);
    });
});

passport.use(sbhs);
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(BodyParser());
app.use(Session(config.session));
app.use(passport.initialize());
app.use(passport.session());
passport.use(sbhs);

app.use(function(req,res,next){
    if(req.user && !req.user.firstSignOnAccepted){
        if(req.url != "/firsttime" && req.url !="/logout"){
            return res.redirect('/firsttime');
        }
    }
    if(req.user){
        req.user.isStudent = req.user.role=="Student" || undefined;
        res.locals.user = req.user;
    }
    next();

});
var router = express.Router();
router.Router = express.Router;
//Require Routers

fs.readdirSync('./routes/').forEach(function(file) {
    fs.stat('./routes/'+file,function(err,stat){
        if(stat.isDirectory()){
            require("./routes/"+file)(router,models,passport);
        }
    });
});
app.use("/",router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

app.get("/sessionTest",function(req,res){
    res.json(req.user);
})
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if(!module.parent){
    app.listen(app.get('port'));
    console.log("Forums started on port "+app.get('port'));
}