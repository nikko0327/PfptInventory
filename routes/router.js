var express = require("express");
var router = express.Router();
var User = require("../models/user");

// TEST
	var Papa = require("babyparse");
	var fs = require("fs");
	var awtoolsStatusAll = "../logs/awtoolStatusAll.txt";
	var importInvCustomerTest = "../logs/importInvCustomer.lst";
	var statusStores = "../logs/awtoolStatusStores.txt";

	// var awtoolsStatusAll = "tempFile/awtoolsStatusAll.txt";
	// var importInvCustomerTest = "tempFile/importInvCustomerTest.txt";
	// var statusStores = "tempFile/awtoolsStatusStores.txt";

	var AW_IP = [];
	var AW_STATUS =[];
	var CUST_GUID = [];
	var CUST_NAME = [];
	var MSG_COUNT = [];
	var BLOB_REPLICATION = [];
	var BLOB_LTS = [];
	var INDEX_REPLICATION = [];
	var INDEX_LTS = [];
	var STRUCTURE_REPLICATION = [];
	var STRUCTURE_LTS = [];


	var statusAllContent = fs.readFileSync(awtoolsStatusAll, { encoding: 'utf8' });
	var parsed = Papa.parse(statusAllContent);
	statData = parsed.data;

	var customerContent = fs.readFileSync(importInvCustomerTest, { encoding: 'utf8' });
	var parsed = Papa.parse(customerContent);
	custData = parsed.data;

	var storeContent = fs.readFileSync(statusStores, { encoding: 'utf8' });
	var parsed = Papa.parse(storeContent);
	storeData = parsed.data;

	// var AW = "";
	// var status = "";
	// var messageCount = "";
	// 	for(var i = 1; i < storeData.length; i++){
	// 		for(var j = 1; j < statData.length; j++){
	// 			if(storeData[i][0] == statData[j][0]){
	// 				AW = statData[j][0];
	// 				status = statData[j][1];
	// 				messageCount = statData[j][7];

	// 				BLOB_REPLICATION.push(statData[j][17]);
	// 				BLOB_LTS.push(statData[j][18]);
	// 				INDEX_REPLICATION.push(statData[j][19]);
	// 				INDEX_LTS.push(statData[j][20]);
	// 				STRUCTURE_REPLICATION.push(statData[j][21]);
	// 				STRUCTURE_LTS.push(statData[j][22]);
	// 			}
	// 		}
	// 		console.log("AW: " + storeData[i][0] + " | Customer GUID: " + storeData[i][1] + " | STATAW: " + AW + " | Status: " + status + " |  Message Count: " + messageCount);
			
	// 		//Adding values to an array for ejs to pickup and parse
	// 		AW_IP.push(storeData[i][0]);
	// 		AW_STATUS.push(status);
	// 		CUST_GUID.push(storeData[i][1]);
	// 		MSG_COUNT.push(messageCount);

	// 		i = i + 2;
	// 	}

	var AW = "";
var status = "";
var messageCount = "";
for(var i = 1; i < statData.length; i++){
	//console.log("IP: " + statData[i][0] + " | Status: " + statData[i][1] + " | Message Count: " + statData[i][7] + "| BOLB REPL: " + statData[i][17] + " | BLOB LTS: " + statData[i][18]
	//	+ " | Index REPL: " + statData[i][19] + "| Index LTS: " + statData[i][20] + " | Structure REPL" + statData[i][21] + " | Structure LTS: " + statData[i][22]);

	for(var j = 1; j < storeData.length; j++){
		if(statData[i][0] === storeData[j][0]){
			// console.log("StatusAll: " + statData[i][0] + " | StoreData: " + storeData[j][0] + " | GUID: " + storeData[j][1]);
			CUST_GUID.push(storeData[j][1]);
			for(var k = 0; k < custData.length; k++){
				if(storeData[j][1] === custData[k][0].replace(" ", "")){
					console.log("StatusAll: " + statData[i][0] + " | StoreData: " + storeData[j][0] + " | GUID: " + storeData[j][1] + " | Customer Name: " + custData[k][1]);
					CUST_NAME.push(custData[k][1]);
				}
			}
			break;
		}
	}

	AW_IP.push(statData[i][0]);
	AW_STATUS.push(statData[i][1]);
	MSG_COUNT.push(statData[i][7]);
	BLOB_REPLICATION.push(statData[i][17]);
	BLOB_LTS.push(statData[i][18]);
	INDEX_REPLICATION.push(statData[i][19]);
	INDEX_LTS.push(statData[i][20]);
	STRUCTURE_REPLICATION.push(statData[i][21]);
	STRUCTURE_LTS.push(statData[i][22]);
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
				res.render("index", {AW_IP: AW_IP, AW_STATUS: AW_STATUS, CUST_GUID: CUST_GUID, CUST_NAME: CUST_NAME, MSG_COUNT: MSG_COUNT, BLOB_REPLICATION: BLOB_REPLICATION, BLOB_LTS: BLOB_LTS, INDEX_REPLICATION: INDEX_REPLICATION, INDEX_LTS: INDEX_LTS, STRUCTURE_REPLICATION: STRUCTURE_REPLICATION, STRUCTURE_LTS: STRUCTURE_LTS});
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