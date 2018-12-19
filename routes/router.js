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
	// var importInvCustomerTest = "tempFile/importInvCustomer.lst";
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

	//Removes the first 3 lines of the text file. If not, it will break the table.
	// var statusAllContent_before_deleting_top2 = fs.readFileSync(awtoolsStatusAll, { encoding: 'utf8' });
	// var statusAllContent = statusAllContent_before_deleting_top2.replace("Logging to: /var/log/fortiva/fortiva-3.5-default-tools.log\nExecuting STATUS for 69 archive writers...\nAW,AW Status,Total,Used,Avail,% Used,Index Size,Msg Count,Queued batches,Queue status,GP Customers,LH Customers,Unregistered Customers,Start date,Capped date,Age,Store flags (Visible; Writable; Recycled; Trashed; Unregistered),Blob replication,Blob LTS,Index replication,Index LTS,Structure Replication,Structure LTS,Lookup replication,Lookup LTS\n", "");
	// console.log(statusAllContent)
	// var parsed = Papa.parse(statusAllContent);
	// statData = parsed.data;

	//Removes the first 3 lines of the text file. If not, it will break the table.
	var statusAllContent = fs.readFileSync(awtoolsStatusAll, { encoding: 'utf8' });
	statusAllContent = statusAllContent.split("\n");
	statusAllContent.splice(0,2);
	statusAllContent = statusAllContent.join("\n");
	var parsed = Papa.parse(statusAllContent);
	statData = parsed.data;
	// console.log(statusAllContent);

	var customerContent = fs.readFileSync(importInvCustomerTest, { encoding: 'utf8' });
	var parsed = Papa.parse(customerContent);
	custData = parsed.data;

	var storeContent = fs.readFileSync(statusStores, { encoding: 'utf8' });
	var parsed = Papa.parse(storeContent);
	storeData = parsed.data;

	var AW = "";
var status = "";
var messageCount = "";
var defaultGUID = "";
for(var i = 1; i < statData.length; i++){
	if(statData[i][1] === "READY"){
		console.log("READY:     " + statData[i][0]);

					AW_IP.push(statData[i][0]);
					AW_STATUS.push(statData[i][1]);
					MSG_COUNT.push(statData[i][7]);
					BLOB_REPLICATION.push(statData[i][17]);
					BLOB_LTS.push(statData[i][18]);
					INDEX_REPLICATION.push(statData[i][19]);
					INDEX_LTS.push(statData[i][20]);
					STRUCTURE_REPLICATION.push(statData[i][21]);
					STRUCTURE_LTS.push(statData[i][22]);
					CUST_NAME.push("OPEN");
					CUST_GUID.push("OPEN");
	}
	// console.log(statData[i][0]);
	//console.log("IP: " + statData[i][0] + " | Status: " + statData[i][1] + " | Message Count: " + statData[i][7] + "| BOLB REPL: " + statData[i][17] + " | BLOB LTS: " + statData[i][18]
	//	+ " | Index REPL: " + statData[i][19] + "| Index LTS: " + statData[i][20] + " | Structure REPL" + statData[i][21] + " | Structure LTS: " + statData[i][22]);
	// console.log("ALL IP:" + statData[i][0] + " - " + statData[i][1]);
	for(var j = 1; j < storeData.length; j++){
		if(statData[i][0] === storeData[j][0]){
			// console.log("PART:" + statData[i][0] + " - " + storeData[j][0] + " - " + storeData[j][1] + " - " + statData[i][1]);
			for(var k = 0; k < custData.length; k++){
				if(storeData[j][1] === custData[k][0].replace(" ", "")){
					console.log("StatusAll: " + statData[i][0] + "|STATUS: " + statData[i][1] + " | " + " | StoreData: " + storeData[j][0] + " | GUID: " + storeData[j][1] + " | Customer Name: " + custData[k][1]);
					

					AW_IP.push(statData[i][0]);
					AW_STATUS.push(statData[i][1]);
					MSG_COUNT.push(statData[i][7]);
					BLOB_REPLICATION.push(statData[i][17]);
					BLOB_LTS.push(statData[i][18]);
					INDEX_REPLICATION.push(statData[i][19]);
					INDEX_LTS.push(statData[i][20]);
					STRUCTURE_REPLICATION.push(statData[i][21]);
					STRUCTURE_LTS.push(statData[i][22]);
					CUST_NAME.push(custData[k][1]);
					CUST_GUID.push(storeData[j][1]);
				}
			}break;
		}
	}

}


//FOR APPLIANCE LIST PAGE
var applianceList = "applianceTempFile/Import_ExportList.csv";

//Array for each column
var NAME = [];
var STATE = [];
var STATUS = [];
var PROVISIONED_SPACE = [];
var USED_SPACE = [];
var HOST_CPU = [];
var HOST_MEM = [];
var IP_ADDRESS = [];

var appList_content = fs.readFileSync(applianceList, { encoding: 'utf8' });
appList_content = appList_content.split("\n");
appList_content.splice(0,1);
appList_content = appList_content.join("\n");


var parsed = Papa.parse(appList_content);
statData = parsed.data;
// console.log(statData[0,0]);

for(var i = 0; i < statData.length; i++){
	// console.log(statData[0, i][0, 0]);
	NAME.push(statData[i][0]);
	STATE.push(statData[i][1]);
	STATUS.push(statData[i][2]);
	PROVISIONED_SPACE.push(statData[i][3]);
	USED_SPACE.push(statData[i][4]);
	HOST_CPU.push(statData[i][5]);
	HOST_MEM.push(statData[i][6]);
	IP_ADDRESS.push(statData[i][7]);
}

console.log("Name Check:");
console.log(NAME);
console.log("End of Name Check");
console.log(STATE);
console.log(STATUS);
console.log(PROVISIONED_SPACE);
console.log(USED_SPACE);
console.log(HOST_CPU);
console.log(HOST_MEM);
console.log(IP_ADDRESS);

//FOR IMPORTNGHW PAGE

// var importngList = "tempFile/importnghw.txt"
var importngList = "../logs/importNGHW.txt";
var importngList_content = fs.readFileSync(importngList, { encoding: 'utf8' });

//Array for each column
var FQDN = [];
var NGIP = [];
var PRODUCT_NAME = [];
var ROLE = [];
var DC = [];
var NOTES = [];
var DISK = [];
var OSIMAGE = [];

 obj = JSON.parse(importngList_content);

console.log("-----------------------JSON START-------------------------");
console.log(obj[0].serial_number);
console.log(obj.length);

for(var i = 0; i < obj.length; i++){
	console.log(i + 1);
	console.log(obj[i].serial_number);
	FQDN.push(obj[i].fqdn);
	NGIP.push(obj[i].ip_address);
	PRODUCT_NAME.push(obj[i].product_name);
	ROLE.push(obj[i].roles);
	DC.push(obj[i].data_center_code);
	var noteFix = obj[i].notes.slice(obj[i].notes.indexOf('[') +1,obj[i].notes.indexOf(']'));
	NOTES.push(noteFix);
	DISK.push(obj[i].disk_layout);
	OSIMAGE.push(obj[i].operating_system_image);
}
console.log("-----------------------JSON END-------------------------");
console.log(FQDN);
console.log(NGIP);
console.log(PRODUCT_NAME);
console.log(ROLE);
console.log(DC);
console.log(NOTES);
console.log(DISK);
console.log(OSIMAGE);


//START OF ROUTING FUNCTIONS

//GET route for reading data
router.get("/", function(req, res, next){
	res.render("login");
});

// //GET for appliance list
// router.get("/appliance", function(req, res, next){
// 	res.render("appliance");
// });

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

//GET route for appliance list
router.get("/appliance", function(req, res, next){
		res.render("appliance", {NAME: NAME, STATE: STATE, STATUS: STATUS, PROVISIONED_SPACE: PROVISIONED_SPACE, USED_SPACE: USED_SPACE, HOST_CPU: HOST_CPU, HOST_MEM: HOST_MEM, IP_ADDRESS: IP_ADDRESS});
});

//GET route for ImportNG
router.get("/importng", function(req, res, next){
		res.render("importng", {FQDN: FQDN, NGIP: NGIP, PRODUCT_NAME: PRODUCT_NAME, ROLE: ROLE, DC: DC, NOTES: NOTES, DISK: DISK, OSIMAGE: OSIMAGE});
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