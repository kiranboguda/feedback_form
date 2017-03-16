/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'ic_feedback_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
//var multipart = require('connect-multiparty')
//var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
    	var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
      //  dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    	 // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;
            }
        }
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
    	 dbCredentials.url = "REPLACE_ME";
    }
  
    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}


initDBConnection();

app.get('/', routes.index);

function createResponseData( feedback,firstname, lastname,email) {

    var responseData = {
    	feedback: feedback,	
        firstname: firstname,
        lastname: lastname,
        email: email
      };

    return responseData;
}

var saveDocument = function(id, feedbackObj, response) {

    if (id === undefined) {
        // Generated random id
        // always start with a letter (for DOM friendlyness)
        var id = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor((Math.random() * 42) + 48);
            if (ascicode < 58 || ascicode > 64) {
                // exclude all chars between : (58) and @ (64)
                id += String.fromCharCode(ascicode);
            }
        } while (id.length < 32);
        
        

    }
    
    console.log('Saving Feedback: ' );

    db.insert(feedbackObj, id, function(err, doc) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } else
            response.sendStatus(200);
        response.end();
    });

}
app.put('/api/savefeedBack', function(request, response) {
	console.log("Save Invoked..");
	var feedback = request.body.feedback;
    var firstname = request.body.firstname;
    var lastname = request.body.lastname;
    var email = request.body.email;
  
    
    var feedbackObj = {
        feedback: feedback,
    	firstname: firstname,
        lastname: lastname,
        email:email
        
        
    }

    saveDocument(null, feedbackObj, response);

});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
