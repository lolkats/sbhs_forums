var config = require('./config'),
    express = require('express'),
    BodyParser = require('body-parser'),
    Session = require('express-session'),
    fs = require('fs'),
    db = require('./lib/db')(config.db),
    models = db.models,
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
var router = express.Router();
router.Router = express.Router;
//Require Routers

fs.readdirSync('./routes/').forEach(function(file) {
    fs.stat('./routes/'+file,function(err,stat){
        if(stat.isDirectory()){
            require("./routes/"+file)(router,models);
        }
    });
});
app.use("/",router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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