var express = require("express");
var router = express.Router();
var User = require("../models/user");

// TEST
	var Papa = require("babyparse");
	var fs = require("fs");
	var awtoolsStatusAll = "/Users/nlee/Desktop/awtoolsStatusAll.csv";
	var importInvCustomerTest = "/Users/nlee/Desktop/importInvCustomerTest.csv";
	var statusStores = "/Users/nlee/Desktop/awtoolsStatusStores.csv";


	var statusAllContent = fs.readFileSync(awtoolsStatusAll, { encoding: 'utf8' });
	var parsed = Papa.parse(statusAllContent);
	statData = parsed.data;

	var customerContent = fs.readFileSync(importInvCustomerTest, { encoding: 'utf8' });
	var parsed = Papa.parse(customerContent);
	custData = parsed.data;

	var storeContent = fs.readFileSync(statusStores, { encoding: 'utf8' });
	var parsed = Papa.parse(storeContent);
	storeData = parsed.data;

	var AW = "";
	var status = "";
	var messageCount = "";
		for(var i = 1; i < storeData.length; i++){
			for(var j = 1; j < statData.length; j++){
				if(storeData[i][0] == statData[j][0]){
					AW = statData[j][0];
					status = statData[j][1];
					messageCount = statData[j][7];
				}
			}
			console.log("AW: " + storeData[i][0] + " | Customer GUID: " + storeData[i][1] + " | STATAW: " + AW + " | Status: " + status + " |  Message Count: " + messageCount);
			i = i + 2;
		}
//TEST

//GET route for reading data
router.get("/", function(req, res, next){
	res.render("login");
});

// POST route for updating data
router.post("/", function(req, res, next){
	//confirm that user typed same password 2 times.
	if(req.body.password !== req.body.passwordConf){
		var err = new Error("Password don't match!");
		err.status = 400;
		res.send("Password do not match!");
		return next(err);
	}

	if(req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf){

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		User.create(userData, function(error, user){
			if(error){
				return next(error);
			}else{
				req.session.userId = user._id;
				return res.redirect("/index");
			}
		});
	} else if(req.body.logemail && req.body.logpassword){
		User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){
			if(error || !user){
				var err = new Error("Wrong email or password.");
				err.status = 401;
				return next(err);
			}else{
				req.session.userId = user._id;
				return res.redirect("/index");
			}
		});
	} else{
		var err = new Error("All fields required!");
		err.status = 400;
		return next(err);
	}
})

//GET route after registering as a new user
router.get("/index", function(req, res, next){
	User.findById(req.session.userId)
	.exec(function(error, user){
		if(error){
			return next(error);
		} else{
			if(user === null){
				var err = new Error("Not an authorized user.");
				err.status = 400;
				return next(err);
			} else{
				//CHANGE TO res.render
				//return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>');
				res.render("index");
			}
		}
	});
});

//GET for logging out
router.get("/logout", function(req, res, next){
	if(req.session){
		//delete session object
		req.session.destroy(function(err){
			if(err){
				return next(err);
			} else{
				return res.redirect("/");
			}
		});
	}
});

module.exports = router;