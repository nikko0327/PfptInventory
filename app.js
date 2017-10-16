var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var app = express();

//connect to MongoDB
var databaseUrl = "mongodb://localhost/pfptInventory"
mongoose.connect(databaseUrl);
var db = mongoose.connection;

//handling mongo error
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", function(){
	//Connection Message?
});

// set so we dont have to type .ejs all the time when routing
app.set("view engine", "ejs");
// used so we can make a public folder that contains stylesheet and js, and be able to access it
app.use(express.static("public"));

//using sessions for tracking logins
app.use(session({
	secret: "work hard",
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

//parsing incoming requests
app.use(bodyParser.json());
// used so we can get data from forms and etc.
app.use(bodyParser.urlencoded({extended: false}));

//so we don't have to type .ejs
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

//including routes. Seperating the routes to different file, so it will be cleaner.
var routes = require("./routes/router");
app.use(routes);

//catch 404 and forward to error handler
app.use(function(){
	var err = new Error("File Not Found");
	err.status = 404;
});

//error handler
//defined as the last app.use callback
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.send(err.message);
});

app.listen(3000, function(){
	console.log("Express app is listening on port 3000");
});


